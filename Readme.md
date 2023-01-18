# TVAP for Plausible Analytics

TVAP (Total Visitors API Proxy ) is a simple and easy-to-use Plausible total visitors API proxy.
This proxy API provides a convenient and secure way to display visitor count data from Plausible on a static website. It allows developers to easily integrate the functionality without the need to expose their Plausible API key or build a custom implementation.

The API is built using Node.js and the Express framework, and utilizes the request-promise-native library to make API calls to Plausible. It also uses the memory-cache library for caching the visitor count data, which can be configured with a custom expiration time.

When a request is made to the API's endpoint, it first checks if the visitor count data is present in cache. If it is, the cached data is returned to the client. If the data is not present in cache, the API makes a request to Plausible's API using the provided API key and site ID. The returned data is then cached and returned to the client.

In addition to the core functionality, the API also includes security features such as helmet and CORS support, as well as request logging. The logs can be written to a file and can be used to track the usage of the API.

## Features

- Caches the visitors data from Plausible API
- Serves the cached data to clients
- Protects API key
- Logs invalid requests
- Supports CORS

## Deployment

This app is deployed as a Docker container and can be easily run using `docker-compose`.

### Prerequisites

- Docker
- Docker Compose

### Deployment Steps

- 1. Clone the repository:

```
git clone https://github.com/njts/tvap && cd tvap
```

- 2. Open the `docker-compose.yml` file and set the necessary environment variables:

```
nano docker-compose.yml
```

`SITE_ID=<your_site_id>`
<br/><br/>
`KEY=<your_api_key>`

> **_NOTE:_** If you are runnig your own Plausible instance on a different machine or using the official plausible.io service, you will need to edit the `BASE` variable in the `docker-compose.yml` file to match the correct IP or hostname of your plausible instance. Also, in this situation, you can disable the `depends_on: plausible` in the `docker-compose.yml` file


- 3. Start the container by running the following command:

```
sudo docker-compose up -d
```

The proxy will be running on port 3000.
You can test it using:

```
curl http://localhost:3000/visitors
```

## Integration examples

### Hugo CMS

- Create a new file in the `layouts/partials` folder of your Hugo website, for example `layouts/partials/visitorcount.html`.
- Then, copy the HTML code into that file:

```
<div id="visitor-count"></div>
<script>
  window.onload = function() {
    fetch('https://<your-proxy-api-endpoint>/visitors')
      .then(response => response.json())
      .then(data => {
        document.getElementById("visitor-count").innerHTML = "So far, this place  has been visited by "+"<span class='lcd-number'>"+data.data.results.visitors.value+"</span> virtual strangers.";
      });
  }
</script>
<style>
    #visitor-count {
        text-align: inline;
    }

    .lcd-number {
        color: rgb(255, 255, 255);
        font-size: 15px;
        font-weight: bold;
    }
</style>
```
- Later, you can add the following line of code in the desired location where you want the visitor count to be displayed

```
{{ partial "visitorcount.html" . }}
```

## Contribution

We welcome contributions to this project. If you find a bug or have an idea for a new feature, please open an issue on GitHub.

## License

TVAP is released under the [MIT License](https://github.com/njts/tvap/blob/master/LICENSE)
