
export default async function listErrorLogs(query = {}) {
    console.log('listErrorLogs called with query:', query);

    // Set default pagination parameters
    const limit = parseInt(query.limit) || 100;
    const offset = parseInt(query.offset) || 0;

    // Build query string for pagination
    const queryString = new URLSearchParams({ limit, offset }).toString();
    const listErrorResponse = await client.apiRequest(`/logs?${queryString}`, 'GET');

    if (listErrorResponse.error) {
        $('.api-response', '#admin-error-logs').html(listErrorResponse.error);
        console.error('Error listing logs:', listErrorResponse.error);
        return;
    }

    $('.api-response', '#admin-error-logs').html(listErrorResponse.message || '');
    console.log('listErrorResponse', listErrorResponse);

    // Clear the table body (not the entire table to preserve thead)
    $('#admin-list-error-logs-table tbody').html('');

    if (listErrorResponse && listErrorResponse.logs && listErrorResponse.logs.length > 0) {
        // Process logs with symbolication if in production mode
        for (const logEntry of listErrorResponse.logs) {
            if (false && this.bp.mode === 'prod') {
                console.log('needs to symbolicate', logEntry);
                const sourceMapped = await symbolicate(logEntry.stack);
                console.log('sourceMapped', sourceMapped);
                logEntry.stack = sourceMapped;
            }

            $('#admin-list-error-logs-table tbody').append(`
                <tr>
                    <td>${new Date(logEntry.ctime).toLocaleString()}</td>
                    <td>${logEntry.type}</td> 
                    <td>${logEntry.message}</td>
                    <td><span class="error-stack">${logEntry.stack}</span> <button class="symbolicate-error">symbolicate</button></td> 
                </tr>
            `);
        }
    } else {
        $('#admin-list-error-logs-table tbody').append(`
            <tr>
                <td colspan="4">No logs found</td>
            </tr>
        `);
    }

    // Update pagination controls
    const pagination = listErrorResponse.pagination || { limit, offset, total: listErrorResponse.logs.length };
    updatePaginationControls.call(this, pagination);
}

// Function to update pagination controls
function updatePaginationControls({ limit, offset, total }) {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit) || 1;

    // Update page info
    $('.page-info', this.adminWindow.content).text(`Page ${currentPage} of ${totalPages}`);

    console.log('Updating pagination controls:', { limit, offset, total });
    // Enable/disable buttons
    //$('.prev-page', this.adminWindow.content).prop('disabled', offset === 0);
    //$('.next-page', this.adminWindow.content).prop('disabled', offset + limit >= total);

    // Set current page size in dropdown
    $('.page-size', this.adminWindow.content).val(limit);

    console.log('Pagination updated:', { limit, offset, total });
    // Event listeners for pagination controls
    $('.prev-page', this.adminWindow.content).off('click').on('click', () => {
        console.log('Prev page clicked');
            listErrorLogs.call(this, { limit, offset: offset - limit });
        if (offset > 0) {
        }
    });

    $('.next-page', this.adminWindow.content).off('click').on('click', () => {
        console.log('Next page clicked');
        listErrorLogs.call(this, { limit, offset: offset + limit });
        if (offset + limit < total) {
        }
    });

    $('.page-size', this.adminWindow.content).off('change').on('change', (e) => {
        const newLimit = parseInt(e.target.value);
        listErrorLogs.call(this, { limit: newLimit, offset: 0 });
    });
}

const client = {};

client.endpoint = buddypond.errorsEndpoint;

client.apiRequest = async (uri, method = 'GET', data = null) => {

    const options = {
        method: method
    };

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-Me": buddypond.me
      };
      if (buddypond.qtokenid) {
        headers["Authorization"] = `Bearer ${buddypond.qtokenid}`; // ✅ Use Authorization header
      }


    if (data) {
        options.body = JSON.stringify(data);
    }

    options.headers = headers;

    let url = `${client.endpoint}${uri}`;
    console.log('admin client making api request', url, options);
 

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in API request:', error);
        throw error;
    }

};

