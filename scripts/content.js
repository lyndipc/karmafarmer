const insert = (content) => {
    // Find gmail editor input selection
    const elements = document.getElementsByClassName('editable');

    if (elements.length === 0) {
        console.log('length 0');
        return;
    }

    const element = elements[0];

    // Grab the first div tag so we can replace it
    const divToRemove = element;
    divToRemove.remove();

    // Split content by \n
    const splitContent = content.split('\n');

    // Wrap in div tags
    splitContent.forEach((content) => {
        const div = document.createElement('div');

        if (content === '') {
            const br = document.createElement('br');
            div.appendChild(br);
        } else {
            div.textContent = content;
        }
    })

    // Insert into HTML one at a time
    element.appendChild(div);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (request, sender, sendResponse) => {

        if (request.message === 'inject') {
            const { content } = request;
            
            const result = insert(content);

            if (!result) {
                sendResponse({ status: 'failed' });
            }
            
            sendResponse({ status: 'success' });
        }
    }
});