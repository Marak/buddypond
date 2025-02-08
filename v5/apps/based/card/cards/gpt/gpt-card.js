export default async function applyData(el, data, cardClass) {

    // will return immediately if cached
    await cardClass.bp.appendScript("https://cdn.jsdelivr.net/npm/prismjs@1.23.0/prism.min.js");
    await cardClass.bp.appendCSS("https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism-coy.css");

    let cloneText = data.message.text;
    cloneText = marked.parse(data.message.text);

    const messageHTML = cloneText;
    const messageTime = new Date(data.message.ctime);
    const currentTime = new Date();
    const timeDifference = (currentTime - messageTime) / 1000; // difference in seconds

    const responseElement = $(el).find('.card-gpt-response');
    responseElement.empty(); // Clear existing content
    data.message.text = 'I have an AI-generated response:';

    if (timeDifference < 30) {
        // Parse the HTML string into DOM nodes
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = messageHTML;

        function typeNode(node, parent, callback) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                let index = 0;

                function typeChar() {
                    if (index < text.length) {
                        parent.append(text.charAt(index));
                        index++;
                        setTimeout(typeChar, 33);
                    } else {
                        if (parent.closest('pre code')) {
                            // Re-apply syntax highlighting when done typing a code block
                            Prism.highlightElement(parent.closest('pre code'));
                        }
                        callback();
                    }
                }
                typeChar();

            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const newElement = document.createElement(node.tagName);
                Array.from(node.attributes).forEach(attr => {
                    newElement.setAttribute(attr.name, attr.value);
                });
                parent.append(newElement);

                const children = Array.from(node.childNodes);
                let childIndex = 0;
                function typeNextChild() {
                    if (childIndex < children.length) {
                        typeNode(children[childIndex], newElement, typeNextChild);
                        childIndex++;
                    } else {
                        callback();
                    }
                }
                typeNextChild();
            } else {
                callback();
            }
        }

        const nodes = Array.from(tempContainer.childNodes);
        let currentNodeIndex = 0;
        function typeNextNode() {
            if (currentNodeIndex < nodes.length) {
                typeNode(nodes[currentNodeIndex], responseElement[0], typeNextNode);
                currentNodeIndex++;
            }
        }
        typeNextNode();

    } else {
        // Display the message immediately
        responseElement.html(messageHTML);
        // Apply syntax highlighting immediately
        responseElement.find('pre code').each(function () {
            Prism.highlightElement(this);
        });
    }

    return data;
}
