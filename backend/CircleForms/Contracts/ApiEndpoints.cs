namespace CircleForms.Contracts;

public static class ApiEndpoints
{
    #region OAuth
    public const string OAuthAuthentication = "/OAuth/auth";
    public const string OAuthSignOut = "/OAuth/signout";
    #endregion

    #region Posts
    #region Post endpoints for users
    public const string PostsAnswer = "/posts/{id}/answers";
    public const string PostsAddPost = "/posts";
    public const string PostsDetailedPost = "/posts/{id}";
    public const string PostsUpdatePost = "/posts/{id}";
    public const string PostsUploadImage = "/posts/{id}/files";
    #endregion

    public const string PostsOneCachedPost = "/posts/cached/{id}";
    public const string PostsAllCachedPosts = "/posts/cached";
    public const string PostsOneDatabasePost = "/posts/mongo/{id}";
    public const string PostsAllDatabasePosts = "/posts/mongo";
    #endregion

    #region Users
    #region Users endpoints for users
    public const string UsersGetUser = "/users/{id}";
    public const string UsersGetMe = "/me";
    public const string UsersGetMinimalUser = "/users/{id}/minimal";
    #endregion

    public const string UsersGetAllUsers = "/users";
    public const string UsersEscalateUserPrivileges = "/users";
    #endregion

    #region Pages
    public const string PostsPage = "/posts/page/{page:int}";
    public const string PostsPagePinned = "/posts/page/pinned";
    #endregion
}
