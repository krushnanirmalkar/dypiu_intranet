package ac.dypiu.keycloak;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RoleModel;
import org.keycloak.models.UserModel;

import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class DirectoryRoleAuthenticator implements Authenticator {

    private final HttpClient httpClient =
        HttpClient.newBuilder().build();

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        UserModel user = context.getUser();

        if (user == null) {
            fail(context, "No authenticated user available.");
            return;
        }

        String email = user.getEmail();

        if (email == null || email.isBlank()) {
            fail(context, "Authenticated user has no email.");
            return;
        }

        String serviceUrl =
            System.getenv("DIRECTORY_ROLE_SERVICE_URL");

        String lookupToken =
            System.getenv("DIRECTORY_LOOKUP_TOKEN");

        if (serviceUrl == null || lookupToken == null) {
            fail(context, "Directory role service is not configured.");
            return;
        }

        try {
            String jsonBody =
                "{\"email\":\"" + escapeJson(email) + "\"}";

            HttpRequest request =
                HttpRequest.newBuilder()
                    .uri(URI.create(serviceUrl + "/resolve"))
                    .header(
                        "Authorization",
                        "Bearer " + lookupToken
                    )
                    .header(
                        "Content-Type",
                        "application/json"
                    )
                    .POST(
                        HttpRequest.BodyPublishers.ofString(
                            jsonBody,
                            StandardCharsets.UTF_8
                        )
                    )
                    .build();

            HttpResponse<String> response =
                httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
                );

            if (response.statusCode() != 200) {
                fail(
                    context,
                    "Directory role lookup failed."
                );
                return;
            }

            String baseRole =
                extractBaseRole(response.body());

            if (
                !"student".equals(baseRole) &&
                !"staff".equals(baseRole)
            ) {
                fail(
                    context,
                    "No valid university role available."
                );
                return;
            }

            synchronizeBaseRole(
                context.getRealm(),
                user,
                baseRole
            );

            context.success();

        } catch (Exception ex) {
            ex.printStackTrace();

            fail(
                context,
                "Unable to verify university role."
            );
        }
    }

    private void synchronizeBaseRole(
        RealmModel realm,
        UserModel user,
        String baseRole
    ) {
        RoleModel studentRole =
            realm.getRole("student");

        RoleModel staffRole =
            realm.getRole("staff");

        if (studentRole == null || staffRole == null) {
            throw new IllegalStateException(
                "Required realm roles student/staff do not exist."
            );
        }

        if ("student".equals(baseRole)) {
            if (user.hasRole(staffRole)) {
                user.deleteRoleMapping(staffRole);
            }

            if (!user.hasRole(studentRole)) {
                user.grantRole(studentRole);
            }

            return;
        }

        if ("staff".equals(baseRole)) {
            if (user.hasRole(studentRole)) {
                user.deleteRoleMapping(studentRole);
            }

            if (!user.hasRole(staffRole)) {
                user.grantRole(staffRole);
            }

            return;
        }

        // No supported base classification:
        // remove automatically managed base roles.
        if (user.hasRole(studentRole)) {
            user.deleteRoleMapping(studentRole);
        }

        if (user.hasRole(staffRole)) {
            user.deleteRoleMapping(staffRole);
        }
    }

    private String extractBaseRole(String json) {
        if (json == null) {
            return null;
        }

        if (json.contains("\"baseRole\":\"student\"")) {
            return "student";
        }

        if (json.contains("\"baseRole\":\"staff\"")) {
            return "staff";
        }

        return null;
    }

    private String escapeJson(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"");
    }

    private void fail(
        AuthenticationFlowContext context,
        String message
    ) {
        context.failure(
            AuthenticationFlowError.INTERNAL_ERROR,
            Response.status(
                Response.Status.INTERNAL_SERVER_ERROR
            )
            .entity(message)
            .build()
        );
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        context.success();
    }

    @Override
    public boolean requiresUser() {
        return true;
    }

    @Override
    public boolean configuredFor(
        KeycloakSession session,
        RealmModel realm,
        UserModel user
    ) {
        return true;
    }

    @Override
    public void setRequiredActions(
        KeycloakSession session,
        RealmModel realm,
        UserModel user
    ) {
    }

    @Override
    public void close() {
    }
}
