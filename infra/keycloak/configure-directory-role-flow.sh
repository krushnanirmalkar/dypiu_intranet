#!/usr/bin/env bash
set -euo pipefail

REALM="${KEYCLOAK_REALM:-dypiu}"
FLOW="DYPIU Post Broker Login"
PROVIDER="dypiu-directory-role-authenticator"
IDP="${KEYCLOAK_IDP:-google}"
CLIENT_ID="${KEYCLOAK_CLIENT_ID:-dypiu-intranet}"
KCADM="${KCADM:-/opt/keycloak/bin/kcadm.sh}"

echo "Configuring DYPIU Directory role flow in realm: $REALM"

# --------------------------------------------------
# 1. Create post-broker flow if it does not exist
# --------------------------------------------------

if "$KCADM" get authentication/flows \
    -r "$REALM" \
    --fields alias \
    | grep -Fq "\"alias\" : \"$FLOW\""; then

    echo "Flow already exists: $FLOW"

else
    echo "Creating flow: $FLOW"

    "$KCADM" create authentication/flows \
        -r "$REALM" \
        -s alias="$FLOW" \
        -s description="Resolve Google Workspace OU and synchronize DYPIU base role" \
        -s providerId="basic-flow" \
        -s topLevel=true \
        -s builtIn=false
fi

# --------------------------------------------------
# 2. Add authenticator if it does not exist
# --------------------------------------------------

FLOW_PATH="${FLOW// /%20}"

get_execution_id() {
    "$KCADM" get \
        "authentication/flows/${FLOW_PATH}/executions" \
        -r "$REALM" \
        --format csv \
        --noquotes \
        --fields id,providerId |
    awk -F',' -v provider="$PROVIDER" '
        $2 == provider { print $1; exit }
    '
}

EXECUTION_ID="$(get_execution_id)"

if [ -z "$EXECUTION_ID" ]; then
    echo "Adding authenticator: $PROVIDER"

    "$KCADM" create \
        "authentication/flows/${FLOW_PATH}/executions/execution" \
        -r "$REALM" \
        -s provider="$PROVIDER"

    EXECUTION_ID="$(get_execution_id)"
else
    echo "Authenticator already exists."
fi

if [ -z "$EXECUTION_ID" ]; then
    echo "ERROR: Could not determine authenticator execution ID." >&2
    exit 1
fi

# --------------------------------------------------
# 3. Make authenticator REQUIRED
# --------------------------------------------------

echo "Setting authenticator requirement to REQUIRED"

"$KCADM" update \
    "authentication/flows/${FLOW_PATH}/executions" \
    -r "$REALM" \
    -n \
    -b "{
      \"id\": \"$EXECUTION_ID\",
      \"requirement\": \"REQUIRED\"
    }"

# --------------------------------------------------
# 4. Attach post-broker flow to Google IdP
# --------------------------------------------------

echo "Attaching flow to identity provider: $IDP"

"$KCADM" update \
    "identity-provider/instances/${IDP}" \
    -r "$REALM" \
    -s postBrokerLoginFlowAlias="$FLOW"

# --------------------------------------------------
# 5. Import Google's picture claim on every login
# --------------------------------------------------

PICTURE_IDP_MAPPER="Google picture"

if "$KCADM" get \
    "identity-provider/instances/${IDP}/mappers" \
    -r "$REALM" \
    --fields name \
    | grep -Fq "\"name\" : \"$PICTURE_IDP_MAPPER\""; then

    echo "Google picture identity-provider mapper already exists."

else
    echo "Creating Google picture identity-provider mapper"

    "$KCADM" create \
        "identity-provider/instances/${IDP}/mappers" \
        -r "$REALM" \
        -s name="$PICTURE_IDP_MAPPER" \
        -s identityProviderAlias="$IDP" \
        -s identityProviderMapper="oidc-user-attribute-idp-mapper" \
        -s 'config."syncMode"=FORCE' \
        -s 'config."claim"=picture' \
        -s 'config."user.attribute"=picture'
fi

# --------------------------------------------------
# 6. Emit the stored picture in this application's tokens
# --------------------------------------------------

CLIENT_UUID="$(
    "$KCADM" get clients \
        -r "$REALM" \
        -q clientId="$CLIENT_ID" \
        --fields id,clientId \
        --format csv \
        --noquotes \
    | awk -F',' -v client="$CLIENT_ID" '$2 == client { print $1; exit }'
)"

if [ -z "$CLIENT_UUID" ]; then
    echo "ERROR: Could not find Keycloak client: $CLIENT_ID" >&2
    exit 1
fi

PICTURE_TOKEN_MAPPER="picture"

if "$KCADM" get \
    "clients/${CLIENT_UUID}/protocol-mappers/models" \
    -r "$REALM" \
    --fields name \
    | grep -Fq "\"name\" : \"$PICTURE_TOKEN_MAPPER\""; then

    echo "Picture token mapper already exists."

else
    echo "Creating picture token mapper for client: $CLIENT_ID"

    "$KCADM" create \
        "clients/${CLIENT_UUID}/protocol-mappers/models" \
        -r "$REALM" \
        -s name="$PICTURE_TOKEN_MAPPER" \
        -s protocol="openid-connect" \
        -s protocolMapper="oidc-usermodel-attribute-mapper" \
        -s 'config."user.attribute"=picture' \
        -s 'config."claim.name"=picture' \
        -s 'config."jsonType.label"=String' \
        -s 'config."id.token.claim"=true' \
        -s 'config."access.token.claim"=true' \
        -s 'config."userinfo.token.claim"=true' \
        -s 'config."multivalued"=false'
fi

echo
echo "DYPIU Directory role flow configured successfully."
