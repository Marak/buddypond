export default async function applyData(el, data, cardClass) {
    console.log('this is our data', data, el);

    const messageText = new String(data.message.text);
    const messageTime = new Date(data.message.ctime);
    const currentTime = new Date();
    const timeDifference = (currentTime - messageTime) / 1000; // difference in seconds

    const responseElement = $(el).find('.card-gpt-response');
    responseElement.empty(); // Clear existing content

    data.message.text = 'I have an AI-generated response:';

    if (timeDifference < 45) {
        // Animate text being typed out
        let index = 0;
        function typeWriter() {
            if (index < messageText.length) {
                responseElement.append(messageText.charAt(index));
                index++;
                setTimeout(typeWriter, 33); // Typing speed (33ms per character)
            }
        }
        typeWriter();
    } else {
        // Display the message immediately
        responseElement.text(messageText);
    }

    console.log('this is our text', messageText);
}
