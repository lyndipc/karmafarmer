const generateCompletionAction = async (info) => {
    try {
        sendMessage('generating...');

        const { selectionText } = info;
        const basePromptPrefix = `Write a story for the r/TrueOffMyChest subreddit about a dad who leaves his wife.`;

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
        console.log(baseCompletion.text);

        sendMessage(baseCompletion.text);
    } catch (error) {
        console.log(error);
        sendMessage(error.toString());
    }
}

const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        })
    })
}

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;

        chrome.tabs.sendMessage(
            activeTab,
            { message: 'inject', content },
            (response) => {
                if (response.status === 'failed') {
                    console.log('injection failed.');
                }
            }
        );
    });
};

const generate = async (prompt) => {
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-002',
            prompt: prompt,
            max_tokens: 1250,
            temperature: 0.7,
        }),
    });

    const completion = await completionResponse.json();
    return completion.choices.pop();
}

chrome.contextMenus.create({
    id: 'context-run',
    title: 'Generate reddit story',
    contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
