namespace CircleForms.Commands;

public class CQRSResponse<T>
{
    public T Data { get; }

    public CQRSResponse(T data)
    {
        StatusCode = 200;
        Data = data;
    }
    public CQRSResponse(int statusCode)
    {
        StatusCode = statusCode;
    }
    public CQRSResponse(int statusCode, string error)
    {
        StatusCode = statusCode;
        Error = error;
    }

    public int StatusCode { get; set; }
    public string Error { get; set; }
}
