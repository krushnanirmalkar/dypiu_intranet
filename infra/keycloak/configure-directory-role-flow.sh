#!/usr/bin/env bash
set -euo pipefail

REALM="${KEYCLOAK_REALM:-dypiu}"
FLOW="DYPIU Post Broker Login"
PROVIDER="dypiu-directory-role-authenticator"
IDP="${KEYCLOAK_IDP:-google}"
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

echo
echo "DYPIU Directory role flow configured successfully."
