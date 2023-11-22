// Function to handle emoticon selection
function selectEmoticon(emoticonId) {
    // Get the clicked emoticon
    var clickedEmoticon = document.getElementById(emoticonId);

    // Check if the clicked emoticon is already selected
    var isAlreadySelected = clickedEmoticon.classList.contains('selected');

    // Deselect all emoticons
    document.querySelectorAll('.material-icons').forEach(function (icon) {
        icon.classList.remove('selected', 'verygood', 'good', 'bad', 'verybad');
    });

    // If the clicked emoticon was not already selected, select it
    if (!isAlreadySelected) {
        clickedEmoticon.classList.add('selected');
    }
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