package ac.dypiu.keycloak;

import org.keycloak.Config;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.Collections;
import java.util.List;

public class DirectoryRoleAuthenticatorFactory
    implements AuthenticatorFactory {

    public static final String ID =
        "dypiu-directory-role-authenticator";

    private static final DirectoryRoleAuthenticator SINGLETON =
        new DirectoryRoleAuthenticator();

    private static final AuthenticationExecutionModel.Requirement[]
        REQUIREMENTS = {
            AuthenticationExecutionModel.Requirement.REQUIRED,
            AuthenticationExecutionModel.Requirement.DISABLED
        };

    @Override
    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getReferenceCategory() {
        return "dypiu-directory-role";
    }

    @Override
    public boolean isConfigurable() {
        return false;
    }

    @Override
    public AuthenticationExecutionModel.Requirement[]
        getRequirementChoices() {
        return REQUIREMENTS;
    }

    @Override
    public String getDisplayType() {
        return "DYPIU Directory Base Role";
    }

    @Override
    public String getHelpText() {
        return "Synchronizes student/staff realm roles "
            + "from Google Workspace OU classification.";
    }

    @Override
    public List<ProviderConfigProperty>
        getConfigProperties() {
        return Collections.emptyList();
    }

    @Override
    public boolean isUserSetupAllowed() {
        return false;
    }

    @Override
    public void init(Config.Scope config) {
    }

    @Override
    public void postInit(
        KeycloakSessionFactory factory
    ) {
    }

    @Override
    public void close() {
    }
}
