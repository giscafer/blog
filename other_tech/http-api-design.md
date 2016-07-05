# HTTP API 设计指南

## 概述

该指南讲解了一系列 HTTP+JSON API 设计经验。这些经验最初来自 
[Heroku 平台 API](https://devcenter.heroku.com/articles/platform-api-reference) 
的实践。

该指南对此 API 进行了补充，并且对 Heroku 的新的内部 API 起到了指导作用。
我们希望在 Heroku 之外的 API 设计者也会对此感兴趣。

本文的目标是在保持一致性，且关注业务逻辑的同时，避免设计歧义。我们一直在寻找
_一种良好的、一致的、文档化的方法_来设计 API，但没必要是_唯一的/理想化的方法_。

本文假设读者已经对 HTTP+JSON API 的基本知识有所了解，
因此不会在指南中涵盖所有的基础概念。

欢迎对该指南给与贡献。

## 目录

* [基础](#基础)
  *  [必须使用 TLS](#必须使用-tls)
  *  [用 Accept 头指定版本](#用-accept-头指定版本)
  *  [利用 Etag 支持缓存](#利用-etag-支持缓存)
  *  [通过 Request-Id 跟踪请求](#通过-request-id-跟踪请求)
  *  [使用 Content-Range 进行分页](#使用-content-range-进行分页)
* [请求](#请求)
  *  [返回适当的状态码](#返回适当的状态码)
  *  [尽可能提供完整的资源](#尽可能提供完整的资源)
  *  [允许 JSON 编码的请求体](#允许-json-码的请求体)
  *  [使用一致的路径格式](#使用一致的路径格式)
  *  [小写的路径和属性](#小写的路径和属性)
  *  [为了方便支持非 id 的引用](#为了方便支持非-id-的引用)
  *  [最少的路径嵌套](#最少的路径嵌套)
* [响应](#响应)
  *  [为资源提供 (UU)ID](#为资源提供-uuid)
  *  [提供标准的时间戳](#提供标准的时间戳)
  *  [使用 ISO8601 格式化的 UTC 时间](#使用-iso8601-格式化的-utc-时间)
  *  [嵌套的外键关系](#嵌套的外键关系)
  *  [生成结构化的错误](#生成结构化的错误)
  *  [显示请求频度限制的状态](#显示请求频度限制的状态)
  *  [在所有请求中都保持 JSON 简洁](#在所有请求中都保持-json-简洁)
* [辅助](#辅助)
  *  [提供机器可识别的 JSON schema](#提供机器可识别的-json-schema)
  *  [提供可读的文档](#提供可读的文档)
  *  [提供可执行的例子](#提供可执行的例子)
  *  [对稳定度进行描述](#对稳定度进行描述)

### 基础

#### 必须使用 TLS

必须使用 TLS 来访问 API，没有例外。任何试图阐明或解释什么时候用它合适，
什么时候用它不合适都是徒劳。让任何请求都需要使用 TLS。

理想情况下，为了避免任何不安全的数据交换，对任何 HTTP 或端口 80 的非 TLS 的请求都应当不进行响应。
实际环境中，这不太可能，所以需要响应 `403 Forbidden`。

由于马虎的/恶意的客户端行为无法提供任何明确的保障，所以不建议使用重定向。
重定向的客户端使得服务器的流量成倍增长，并且会在第一次调用的时候让敏感的数据暴露出来，使得 TLS 不起作用。

#### 用 Accept 头指定版本

从一开始就对 API 添加版本。使用 `Accept` 头和自定义的内容类型来指定版本，例如：

```
Accept: application/vnd.heroku+json; version=3
```

最好不要用默认的版本，让客户端明确指出它们需要使用的版本。

#### 利用 Etag 支持缓存

在所有响应中包含 `ETag` 头，用以标识返回资源的特定版本。
用户应当可以在随后的请求中，通过在 `If-None-Match` 头中指定该值来检查过期。

#### 通过 Request-Id 跟踪请求

在每个 API 响应中包含 `Request-Id` 头，并附加一个 UUID 值。
如果服务器和客户端都对该值进行了记录，那么在跟踪和调试请求的时候会非常有用。

#### 使用 Content-Range 进行分页

对任何响应都进行分页，使得大量数据容易被处理。
使用 `Content-Range` 头来传递分页请求。参阅 [Heroku Platform API on Ranges](https://devcenter.heroku.com/articles/platform-api-reference#ranges) 中的例子来了解请求和响应的头、状态码、上限、排序和跳转的细节。

### 请求

#### 返回适当的状态码

对每一个请求都返回适当的 HTTP 状态码。根据本指南，成功的响应当使用以下代码：

* `200`: 对于 `GET` 以及完全同步的 `DELETE` 或 `PATCH` 的请求成功时
* `201`: 对于完全同步的 `POST` 请求成功时
* `202`: 对于异步的 `POST`、`DELETE` 或 `PATCH` 请求被接受
* `206`: `GET` 请求成功，不过只有部分内容被返回：参阅[前面关于分页的内容](#使用-content-range-进行分页)

在使用身份验证与身份验证错误码时务必当心：

* `401 Unauthorized`: 由于用户未进行身份验证，所以请求失败
* `403 Forbidden`: 由于用户无权对特定资源进行访问，所以请求失败

当遇到错误的时候，需要返回合适的代码里提供附加的信息：

* `422 Unprocessable Entity`: 请求可以被解析，但包含了错误的参数
* `429 Too Many Requests`: 请求达到频度限制，稍候再试
* `500 Internal Server Error`: 服务器发生了一些错误，检查状态站点或提交一个 issue

参阅 [HTTP response code spec](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
了解用户错误与服务器错误的情况下的状态码。

#### 尽可能提供完整的资源

在可能的情况下，在响应中提供完整的资源（例如对象和其所有属性）。
在 200 和 201 响应中提供完整的资源，包括 `PUT`/`PATCH` 和 `DELETE` 请求，例如：

```
$ curl -X DELETE \  
  https://service.com/apps/1f9b/domains/0fd4

HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
...
{
  "created_at": "2012-01-01T12:00:00Z",
  "hostname": "subdomain.example.com",
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "updated_at": "2012-01-01T12:00:00Z"
}
```

202 响应将不会包含完整的资源，例如：

```
$ curl -X DELETE \  
  https://service.com/apps/1f9b/dynos/05bd

HTTP/1.1 202 Accepted
Content-Type: application/json;charset=utf-8
...
{}
```

#### 允许 JSON 编码的请求体

对于 `PUT`/`PATCH`/`POST` 允许使用 JSON 编码的请求体，可以看作是对表单数据的替换或补充。
这与 JSON 编码的响应体对称，例如：

```
$ curl -X POST https://service.com/apps \
    -H "Content-Type: application/json" \
    -d '{"name": "demoapp"}'

{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "demoapp",
  "owner": {
    "email": "username@example.com",
    "id": "01234567-89ab-cdef-0123-456789abcdef"
  },
  ...
}
```

#### 使用一致的路径格式

##### 资源名

使用附带版本的资源名称，除非该资源在系统中仅有一个实例（例如，在大多数系统里，一个给定的用户只能有一个账户）。
这与引用特定资源的方法一致。

##### 操作

对于个别无须特定操作的资源，宁可使用直接的布局。而需要特定操作的情况下，
将其放置在标准的 `actions` 前缀后，来描述它们：

```
/resources/:resource/actions/:action
```
例如：

```
/runs/{run_id}/actions/stop
```

#### 小写的路径和属性

使用小写的、横线分隔的路径名称，与主机名一致，例如：

```
service-api.com/users
service-api.com/app-setups
```
属性也小写，但是使用下划线分隔，这样属性名在 JavaScript 里无须转义，例如：

```
service_class: "first"
```

#### 为了方便支持非 id 的引用

在某些情况下，让最终用户提供 ID 来标识一个资源可能不是那么方便。
例如，用户可能想的是 HeroKu 的应用名称，但是那个应用可能是用 UUID 标识的。
在这种情况里，可能需要同时接受 ID 和名称，例如：

```
$ curl https://service.com/apps/{app_id_or_name}
$ curl https://service.com/apps/97addcf0-c182
$ curl https://service.com/apps/www-prod
```
不要仅接受名字，而将 ID 排除在外。

#### 最少的路径嵌套

在数据模型中有着父子嵌套关系的资源，路径可能会深层嵌套，例如：

```
/orgs/{org_id}/apps/{app_id}/dynos/{dyno_id}
```
限制嵌套的深度，让资源相对于根路径来定位。使用嵌套来表示域集合。
例如，上面的例子中 dyno 属于一个 app，app 属于一个 org：

```
/orgs/{org_id}
/orgs/{org_id}/apps
/apps/{app_id}
/apps/{app_id}/dynos
/dynos/{dyno_id}
```

### 响应

#### 为资源提供 (UU)ID

给每个资源一个默认的 `id` 属性。除非有一个好理由，否则还是使用 UUID 吧。
不要使用那些在跨服务器实例或服务的其他资源中不是全局唯一的 ID，特别是不要使用自增 ID。

将 UUID 定义为小写的 `8-4-4-4-12` 格式，例如：

```
"id": "01234567-89ab-cdef-0123-456789abcdef"
```

#### 提供标准的时间戳

为资源默认提供 `created_at` 和 `updated_at` 时间戳，例如：

```json
{
  ...
  "created_at": "2012-01-01T12:00:00Z",
  "updated_at": "2012-01-01T13:00:00Z",
  ...
}
```
这些时间说对于某些资源来说可能没有实际意义，在这些情况下它们可以被省略。

#### 使用 ISO8601 格式化的 UTC 时间

只使用 UTC 接收或返回时间。用 ISO8601 格式表达时间，例如：

```
"finished_at": "2012-01-01T12:00:00Z"
```

#### 嵌套的外键关系

用嵌套的对象来表达外键关系，例如：

```json
{
  "name": "service-production",
  "owner": {
    "id": "5d8201b0..."
  },
  ...
}
```

而不是：

```json
{
  "name": "service-production",
  "owner_id": "5d8201b0...",
  ...
}
```

这一机制允许嵌入更多相关资源的信息，而无须修改响应的数据结构，或引入更多的顶级字段，例如：

```json
{
  "name": "service-production",
  "owner": {
    "id": "5d8201b0...",
    "name": "Alice",
    "email": "alice@heroku.com"
  },
  ...
}
```

#### 生成结构化的错误

生成一致的、结构化的错误响应。包括机器可识别的错误 `id`，人工可读的错误 `信息`，
以及可选的 `url` 引导客户了解关于错误的更进一步的信息和解决方案，例如：

```
HTTP/1.1 429 Too Many Requests
```

```json
{
  "id":      "rate_limit",
  "message": "Account reached its API rate limit.",
  "url":     "https://docs.service.com/rate-limits"
}
```
对错误格式和客户端可能遇到的错误 `id` 编写文档。

#### 显示请求频度限制的状态

限制客户端的请求频度可以保护服务，并保持其他客户端较高的服务质量。可以使用 
[token bucket algorithm](http://en.wikipedia.org/wiki/Token_bucket) 来验证请求的频度。

在每个请求里都用 `RateLimit-Remaining` 响应头返回请求 token 的剩余请求数。

#### 在所有请求中都保持 JSON 简洁

额外的空白字符会增加响应的大小，这是不必要的，而许多人工的客户端都会自动“美化” JSON 的输出。
所以最好让 JSON 的响应保持最小，例如：

```json
{"beta":false,"email":"alice@heroku.com","id":"01234567-89ab-cdef-0123-456789abcdef","last_login":"2012-01-01T12:00:00Z", "created_at":"2012-01-01T12:00:00Z","updated_at":"2012-01-01T12:00:00Z"}
```

而不是：

```json
{
  "beta": false,
  "email": "alice@heroku.com",
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "last_login": "2012-01-01T12:00:00Z",
  "created_at": "2012-01-01T12:00:00Z",
  "updated_at": "2012-01-01T12:00:00Z"
}
```
也可以考虑为客户端增加可选的方式来输出更详细的响应，不论是通过请求参数（例如 `?pretty=true`）
或者通过 `Accept` 头参数（例如 `Accept: application/vnd.heroku+json; version=3; indent=4;`）。

### 辅助

#### 提供机器可识别的 JSON schema

提供机器可识别的 schema 来明确你的 API。使用 [prmd](https://github.com/interagent/prmd)
来管理这些模式，并用 `prmd verify` 来验证。

#### 提供可读的文档

提供可读的文档来让客户端开发者了解你的 API。

如果用上面提到的 prmd 创建了一个 schema，就可以很容易的通过 
`prmd doc` 为所有接口创建 Markdown 文档。

作为接口的附加细节，为 API 提供以下信息的概述：

* 身份验证，包括获得和使用身份验证 token；
* API 的稳定程度与版本状况，包括如何选择目标版本的 API；
* 通用的请求和响应头；
* 错误的格式；
* 不同客户端语言的使用示例。

#### 提供可执行的例子

提供用户可以直接在终端中输入来了解 API 调用情况的可执行的例子。
为了最大程度的可扩展性，这些例子应当每行都可以使用，
以降低用户尝试这些 API 的工作量，例如：

```
$ export TOKEN=... # acquire from dashboard
$ curl -is https://$TOKEN@service.com/users
```

如果你使用 [prmd](https://github.com/interagent/prmd) 来生成 Markdown 文档，
你可以很容易的获得每个接口的例子。

#### 对稳定度进行描述

对你的 API 的稳定程度进行描述，包括不同接口的成熟度和稳定度。
例如，使用 prototype/development/production 标识。

参阅 [Heroku API compatibility policy](https://devcenter.heroku.com/articles/api-compatibility-policy)
了解可能的稳定度和变更管理的方法。

一旦 API 被定义为生产环境适用且为稳定的，就不要对那个版本的 API 进行任何会破坏向后兼容性的改变。
如果需要进行向后不兼容的修改，创建一个具有更高版本号的新 API。


collect from [github](https://github.com/mikespook/http-api-design-zh-cn)

