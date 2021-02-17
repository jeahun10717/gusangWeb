#  \<URL LIST\>

## 1. youtube api 관련

1. 채널 상태 알려주는 api
https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC1Ei9xWth3jnYypj161vBJA&fields=items/statistics&key=AIzaSyDTdPsfPOGSV1mgIIsLgyvH02f9vRPEiZk
결과값은 아래와 같다.

```
{
  "error": {
    "code": 403,
    "message": "The request is missing a valid API key.",
    "errors": [
      {
        "message": "The request is missing a valid API key.",
        "domain": "global",
        "reason": "forbidden"
      }
    ],
    "status": "PERMISSION_DENIED"
  }
}
```

2. 채널의 영상 리스트를 가져오는 api
https://www.googleapis.com/youtube/v3/search?key=AIzaSyDTdPsfPOGSV1mgIIsLgyvH02f9vRPEiZk&channelId=UC1Ei9xWth3jnYypj161vBJA&part=snippet,id&order=date&maxResults=200
결과값은 아래와 같다
```
{
  "kind": "youtube#searchListResponse",
  "etag": "Jj8vnWZb-ir1p8rIs0vEgHZMa8Q",
  "nextPageToken": "CAUQAA",
  "regionCode": "KR",
  "pageInfo": {
    "totalResults": 1000000,
    "resultsPerPage": 5
  },
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "7627eFhn2vtYBjXi590iBr2SWEA",
      "id": {
        "kind": "youtube#video",
        "videoId": "UkoboFsY9_g"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "_zJaYEbcma9zMGlNq9HHNDSpXZ0",
      "id": {
        "kind": "youtube#video",
        "videoId": "QsacpJwXCO8"
      }
    },
    {
//생략
}
```
