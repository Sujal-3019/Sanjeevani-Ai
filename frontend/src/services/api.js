const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';


async function request(
    endpoint,
    options = {},
) {
    const {
        method = 'GET',
        body,
        token,
        headers = {},
    } = options;

    const requestHeaders = {
        Accept: 'application/json',
        ...headers,
    };

    if (body !== undefined) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method,
            headers: requestHeaders,
            body: body !== undefined
                ? JSON.stringify(body)
                : undefined,
        },
    );

    let data = null;

    const contentType =
        response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();

        if (text) {
            data = {
                detail: text,
            };
        }
    }

    if (!response.ok) {
        const error = new Error(
            data?.detail ||
            data?.message ||
            `Request failed with status ${response.status}.`,
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}


export const api = {
    get(endpoint, options = {}) {
        return request(
            endpoint,
            {
                ...options,
                method: 'GET',
            },
        );
    },

    post(endpoint, body, options = {}) {
        return request(
            endpoint,
            {
                ...options,
                method: 'POST',
                body,
            },
        );
    },

    put(endpoint, body, options = {}) {
        return request(
            endpoint,
            {
                ...options,
                method: 'PUT',
                body,
            },
        );
    },

    patch(endpoint, body, options = {}) {
        return request(
            endpoint,
            {
                ...options,
                method: 'PATCH',
                body,
            },
        );
    },

    delete(endpoint, options = {}) {
        return request(
            endpoint,
            {
                ...options,
                method: 'DELETE',
            },
        );
    },
};


export { API_BASE_URL };