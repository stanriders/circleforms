using CircleForms.Database.Models.Users;
using Hangfire.Dashboard;

namespace CircleForms.Hangfire;

public class AuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        return httpContext.User.Identity?.IsAuthenticated == true &&
               httpContext.User.HasClaim(x => x.Value == RoleConstants.Admin);
    }
}
