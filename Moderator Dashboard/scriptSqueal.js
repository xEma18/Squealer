// Function to handle emoticon selection
function selectEmoticon(emoticonId) {
    if(document.querySelector(emoticonId).classList){
        emoticonId.classList.remove('selected');
    }
    // Deselect all emoticons
    document.querySelectorAll('.material-icons').forEach(function (icon) {
        icon.classList.remove('selected');
    });

    // Select the clicked emoticon
    var selectedEmoticon = document.getElementById(emoticonId);
    selectedEmoticon.classList.add('selected');
}

// Attach click event listeners to each emoticon
document.getElementById('verygood').addEventListener('click', function () {
    selectEmoticon('verygood');
});

document.getElementById('good').addEventListener('click', function () {
    selectEmoticon('good');
});

document.getElementById('bad').addEventListener('click', function () {
    selectEmoticon('bad');
});

document.getElementById('verybad').addEventListener('click', function () {
    selectEmoticon('verybad');
});