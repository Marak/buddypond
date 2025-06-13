// probably can move to pond related code
export default function updateRoomList(contextName, chatWindow) {
    const roomList = $(".aim-room-list-items", chatWindow.content);
    if (!roomList.length) return;

    const existingRoom = $(`.aim-room-item[data-context="${contextName}"]`, roomList);
    if (existingRoom.length) {
        $(".aim-room-item", roomList).removeClass("aim-room-active");
        existingRoom.addClass("aim-room-active");
        return;
    }

    const roomItem = document.createElement("li");
    roomItem.className = "aim-room-item aim-room-active";
    roomItem.dataset.context = contextName;
    roomItem.textContent = contextName.replace("pond/", "");
    $(".aim-room-item", roomList).removeClass("aim-room-active");
    roomList.append(roomItem);
}