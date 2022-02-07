namespace CircleForms.Contracts.V1;

public static class ApiEndpoints
{
    #region OAuth
    public const string OAuthAuthentication = "/v1/OAuth/auth";
    public const string OAuthSignOut = "/v1/OAuth/signout";
    #endregion

    #region Posts
    #region Post endpoints for users
    public const string PostsAnswer = "/v1/{id}/answer";
    public const string PostsAddPost = "/v1/posts";
    public const string PostsOneCachedPost = "/v1/posts/{id}";
    public const string PostsDetailedPost = "/v1/posts/{id}/detailed";
    public const string PostPage = "/v1/posts/page/{page:int}";
    #endregion

    public const string PostsAllCachedPosts = "/v1/posts";
    public const string PostsOneDatabasePost = "/v1/posts/mongo/{id}";
    public const string PostsAllDatabasePosts = "/v1/posts/mongo";
    #endregion

    #region Users
    #region Users endpoints for users
    public const string UsersGetMe = "/v1/me";
    #endregion

    public const string UsersGetUser = "/v1/users/{id}";
    public const string UsersGetAllUsers = "/v1/users";
    public const string UsersEscalateUserPrivileges = "/v1/users";
    #endregion
}
