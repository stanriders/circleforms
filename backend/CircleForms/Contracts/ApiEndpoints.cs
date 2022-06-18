namespace CircleForms.Contracts;

public static class ApiEndpoints
{
    #region OAuth
    public const string OAuthAuthentication = "/OAuth/auth";
    public const string OAuthSignOut = "/OAuth/signout";
    #endregion

    #region Admin
    public const string PostsOneCachedPost = "posts/cached/{id}";
    public const string PostsAllCachedPosts = "posts/cached";
    public const string PostsOneDatabasePost = "posts/mongo/{id}";
    public const string PostsAllDatabasePosts = "posts/mongo";
    public const string UsersGetAllUsers = "users";
    public const string UsersEscalateUserPrivileges = "users";
    #endregion

    #region Posts
    public const string PostsAnswer = "{id}/answers";
    public const string PostsAddPost = "";
    public const string PostsDetailedPost = "{id}";
    public const string PostsUpdatePost = "{id}";
    public const string PostsUploadImage = "{id}/files";
    public const string PostPublish = "{id}/publish";
    public const string PostUnpublish = "{id}/unpublish";
    public const string PostsPublishedIds = "all";
    public const string PostsPublishedCount = "all/count";
    #endregion

    #region Users
    public const string UsersGetUser = "{id}";
    public const string UsersGetMe = "/me";
    public const string UsersGetMePosts = "/me/posts";
    public const string UsersGetMeAnswers = "/me/answers";
    public const string UsersGetMinimalUser = "{id}/minimal";
    #endregion

    #region Pages
    public const string PostsPage = "/posts/page/{page:int}";
    public const string PostsPagePinned = "/posts/page/pinned";
    #endregion
}
