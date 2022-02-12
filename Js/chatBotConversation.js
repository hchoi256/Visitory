// Selecting element to view chat
var chatBotSession = document.querySelector(".chatBot .chatBody .chatSession")

// Selecting trigger elements of conversation
var chatBotSendButton = document.querySelector(".chatBot .chatForm #sendButton")
var chatBotTextArea = document.querySelector(".chatBot .chatForm #chatTextBox")

// Default values for replies
var chatBotInitiateMessage = `Hello! I am ChatBot.
When did you search it?
1 : with in 24 hour
2 : with in 3 days
3 : with in one week
4 : I have NO IDEA`
var chatBotBlankMessageReply = "Type something!"
var chatBotReply = "empty reply"
var askWhere = "Which website was it?"
var askKeyword = "Could you think of any keyword related with your search?           you can provide up to 3 keywords separated with space"
var finalOutput = ""
var count = 0

// Values to return
var timeV = document.createElement("div")
timeV.setAttribute("id", "when")

var whereV = document.createElement("div")
whereV.setAttribute("id", "where")

var keyV = document.createElement("div")
keyV.setAttribute("id", "key")

// Collecting user input
var inputMessage = ""

// This helps generate text containers in the chat
var typeOfContainer = ""

// Function to open ChatBot
chatBotSendButton.addEventListener("click", (event) => {
    // Since the button is a submit button, the form gets submittd and the complete webpage reloads. This prevents the page from reloading. We would submit the message later manually
    event.preventDefault()
    if (validateMessage()) {
        inputMessage = chatBotTextArea.value
        typeOfContainer = "message"
        createContainer(typeOfContainer)
        setTimeout(function () {
            typeOfContainer = "reply"
            createContainer(typeOfContainer)
        }, 750);
    }
    else {
        typeOfContainer = "error";
        createContainer(typeOfContainer)
    }
    chatBotTextArea.value = ""
    chatBotTextArea.focus()
})

function createContainer(typeOfContainer) {
    var containerID = ""
    var textClass = ""
    switch (typeOfContainer) {
        case "message":
            // This would create a message container for user's message
            containerID = "messageContainer"
            textClass = "message"
            break;
        case "reply":
        case "initialize":
        case "error":
            // This would create a reply container for bot's reply
            containerID = "replyContainer"
            textClass = "reply"
            break;
        default:
            alert("Error! Please reload the webiste.")
    }

    // Creating container
    var newContainer = document.createElement("div")
    newContainer.setAttribute("class", "container")
    if (containerID == "messageContainer")
        newContainer.setAttribute("id", "messageContainer")
    if (containerID == "replyContainer")
        newContainer.setAttribute("id", "replyContainer")
    chatBotSession.appendChild(newContainer)

    switch (textClass) {
        case "message":
            var allMessageContainers = document.querySelectorAll("#messageContainer")
            var lastMessageContainer = allMessageContainers[allMessageContainers.length - 1]
            var newMessage = document.createElement("p")
            newMessage.setAttribute("class", "message animateChat")
            newMessage.innerHTML = inputMessage
            lastMessageContainer.appendChild(newMessage)
            lastMessageContainer.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            break
        case "reply":
            var allReplyContainers = document.querySelectorAll("#replyContainer")
            var lastReplyContainer = allReplyContainers[allReplyContainers.length - 1]
            var newReply = document.createElement("p")

            newReply.setAttribute("class", "reply animateChat accentColor")
            switch (typeOfContainer) {
                case "reply":
                    count = count + 1
                    switch (count) {
                        case 0:
                            newReply.innerHTML = chatBotInitiateMessage
                            break
                        case 1:
                            //inputMessage time variable 
                            timeV = timeStamp(inputMessage)
                            newReply.innerHTML = askWhere
                            break
                        case 2:
                            // url related stuff
                            whereV = inputMessage
                            newReply.innerHTML = askKeyword
                            break
                        case 3:
                            // keyword + call back end function
                            keyV = keyWordArray(inputMessage)
                            newReply.innerHTML = document.getElementById("data2").innerText // @@@@@
                            // newReply.innerHTML = keyV[1] //must be changed with the sorted list
                            break
                        default:
                            newReply.innerHTML = "Sorry! All the information has been provided."
                            break
                    }
                    break
                case "initialize":

                    newReply.innerHTML = chatBotInitiateMessage
                    break
                case "error":
                    newReply.innerHTML = chatBotBlankMessageReply
                    break
                default:
                    newReply.innerHTML = "Sorry! I could not understannd."
            }

            setTimeout(function () {
                lastReplyContainer.appendChild(newReply)
                lastReplyContainer.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }, 10)
            break
        default:
            console.log("Error in conversation")
    }
}

function initiateConversation() {
    chatBotSession.innerHTML = ""
    typeOfContainer = "initialize"
    createContainer(typeOfContainer)
}

function finalRes() {
    // keyV whereV whenV
    var jsn = JSON.parse(document.getElementById("data2").innerText);
    var res = "[";
    for (var element of jsn) {
        var keys = Object.keys(element);

        // step 1: WHEN
        // search data within a certain period of time
        if (keys.indexOf('lastVisitTime')) {
            // id: when
            var value = element["lasVisitTime"];
            if (value < document.getElementById("when").innerText)
                break;
        } else
            continue;

        // step 2: WHERE
        // check if 'url' contains user input (where)
        if (keys.indexOf('url')) {
            var url = element.url.split(/&|\?/);
            if (!url[0].indexOf(document.getElementById('where').innerText))
                continue; // 'where' not found
            
            var comma = ", ";
            res = res.concat(comma.concat(JSON.stringify(url)));
        } else
            continue;

        // step 3: KEYWORD
        // check if 'title' contains user input (keyword)
        if (keys.indexOf('title')) {
            var keywords = document.getElementById('key').innerText;
            var flag = new Boolean(0);

            for (var e of keywords) {
                if (!element.title.indexOf(e)) {
                    flag = new Boolean(true);
                    break;
                }
            }

            if (flag)
                continue;
        } else
            continue;

        // all pass
        // var comma = ", ";
        // res = res.concat(comma.concat(JSON.stringify(element)));
    }

    res = res.concat(']').replace(/^\[,\s*/, "["); // remove first comma
    data2.appendChild(document.createTextNode(res));
}