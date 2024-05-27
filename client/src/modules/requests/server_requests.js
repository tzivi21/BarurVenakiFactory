const request = async (url, method, body = null, token = null, content_type = null) => {
  let headers;
  if (content_type) {
     headers = {
      "Content-Type": content_type,
    };
  }
  else {
     headers = {
      "Content-Type": "application/json",
    };
  }

  if (token) {
    headers["XAuthentication-Token"] = token;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(responseBody.message || response.statusText);
    }
    const newtoken = response.headers.get('XAuthentication-Token');
    if (url == "http://localhost:3000/login") {
      const status = response.headers.get('XSecurity-Level');
      return {
        ok: true,
        statusCode: response.status,
        body: responseBody,
        token: newtoken,
        status: status
      };

    }
    return {
      ok: true,
      statusCode: response.status,
      body: responseBody,
      token: newtoken
    };
  } catch (error) {
    return {
      ok: false,
      statusCode: error.response ? error.response.status : 500,
      body: { message: error.message },
      token: token
    };
  }
};

export const getRequest = (url, token = null) => request(url, "GET", null, token);
export const postRequest = (url, body, token = null) => request(url, "POST", body, token);
export const putRequest = (url, body, token = null) => request(url, "PUT", body, token, content_type = null);
export const deleteRequest = (url, body, token = null) => request(url, "DELETE", body = null, token);
