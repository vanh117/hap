// Story content and choices
const storyData = {
    "start": {
        text: "The big match begins. The crowd's roar echoes around the stadium. Your team needs a goal to win. You feel the weight of the moment, knowing this could define your career.",
        video: "start.mp4",
        choices: [
            { text: "Lead a solo attack", value: "solo-attack" },
            { text: "Pass to your teammate", value: "pass" }
        ]
    },
    "solo-attack": {
        text: "You decide to take the solo attack. You dribble past the first defender, feeling the adrenaline. The crowd's tension rises as you approach the second defender.",
        video: "solo-attack.mp4",
        choices: [
            { text: "Attempt a long shot", value: "long-shot" },
            { text: "Push deeper into the defense", value: "push-deeper" }
        ]
    },
    "pass": {
        text: "You pass to your teammate, making a clever through-ball. Your teammate is in position, and you rush forward to support the play.",
        video: "pass.mp4",
        choices: [
            { text: "Move to the penalty box, expecting a cross", value: "move-penalty" },
            { text: "Hang back and position for a rebound", value: "position-rebound" }
        ]
    },
    "long-shot": {
        text: "You attempt a long shot from outside the penalty box. The ball sails with power towards the top corner, the goalkeeper leaps...",
        video: "long-shot.mp4",
        choices: [
            { text: "Prepare to celebrate", value: "celebrate" },
            { text: "Regret the decision", value: "missed-shot" }
        ]
    },
    "celebrate": {
        text: "The ball went to the air",
        video: "abc.mp4"
    },
    "push-deeper": {
        text: "You push deeper into the defense, sidestepping the tackle and finding yourself one-on-one with the keeper.",
        video: "push-deeper.mp4",
        choices: [
            { text: "Attempt a finesse shot", value: "finesse-shot" },
            { text: "Strike powerfully to the far post", value: "power-shot" }
        ]
    },
    "move-penalty": {
        text: "You sprint to the penalty box, anticipating your teammate's cross. The ball comes in, perfectly aligned with your run.",
        video: "move-penalty.mp4",
        choices: [
            { text: "Attempt a header", value: "header" },
            { text: "Go for a volley", value: "volley" }
        ]
    },
    "position-rebound": {
        text: "You hang back, waiting for a potential rebound. The shot comes in from your teammate, and the goalkeeper fumbles, sending the ball your way.",
        video: "position-rebound.mp4",
        choices: [
            { text: "Shoot quickly", value: "quick-shot" },
            { text: "Take a touch to control the ball", value: "control-shot" }
        ]
    },
    "finesse-shot": {
        text: "You attempt a finesse shot, curling the ball around the keeper. The stadium holds its breath as it curves towards the goal...",
        video: "finesse-shot.mp4",
        choices: [
            { text: "Watch the ball hit the net", value: "goal" },
            { text: "Gasp as the ball misses by inches", value: "missed-shot" }
        ]
    },
    "power-shot": {
        text: "You unleash a powerful shot to the far post. The ball moves with incredible speed. The keeper dives desperately...",
        video: "power-shot.mp4",
        choices: [
            { text: "Jump in celebration", value: "goal" },
            { text: "Drop to your knees in disbelief", value: "missed-shot" }
        ]
    },
    "header": {
        text: "You leap into the air for a header, aiming down and away from the goalkeeper. The ball connects with your forehead perfectly.",
        video: "header.mp4",
        choices: [
            { text: "See the net ripple", value: "goal" },
            { text: "Watch it go wide", value: "missed-shot" }
        ]
    },
    "volley": {
        text: "You go for a volley, timing your shot perfectly. The ball flies off your boot with incredible force...",
        video: "volley.mp4",
        choices: [
            { text: "Celebrate as the ball hits home", value: "goal" },
            { text: "Groan as the shot misses", value: "missed-shot" }
        ]
    },
    "quick-shot": {
        text: "You quickly shoot without hesitation. The ball moves towards the bottom corner, out of the goalkeeper's reach...",
        video: "quick-shot.mp4",
        choices: [
            { text: "Raise your arms in victory", value: "goal" },
            { text: "Watch in horror as it rolls wide", value: "missed-shot" }
        ]
    },
    "control-shot": {
        text: "You take a touch to control the ball. The defender is closing in. You shoot just before they can tackle...",
        video: "control-shot.mp4",
        choices: [
            { text: "Feel the glory of a goal", value: "goal" },
            { text: "Feel the despair of a miss", value: "missed-shot" }
        ]
    },
    "goal": {
        text: "Goal! The ball hits the back of the net. The crowd erupts, your teammates swarm you in celebration. You've done it—victory is yours!",
        video: "goal.mp4",
        choices: []
    },
    "missed-shot": {
        text: "The shot misses. The final whistle blows. The crowd sighs, and your teammates look deflated. You gave it your all, but victory slipped away.",
        video: "missed-shot.mp4",
        choices: []
    }
};

const videoElement = document.getElementById('story-video');

// Function to change video based on the scene
function playVideo(videoFile) {
    videoElement.src = videoFile;
    videoElement.load();
    videoElement.play();
}

// Function to display a scene
function displayStory(scene) {
    const story = storyData[scene];
    document.getElementById("story-text").innerText = story.text;
    
    // Play the associated video
    playVideo(story.video);
    
    // Clear previous choices
    const choicesContainer = document.getElementById("choices-container");
    choicesContainer.innerHTML = "";

    // Create choice buttons
    story.choices.forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.classList.add("choice-button");
        button.addEventListener("click", () => displayStory(choice.value));
        choicesContainer.appendChild(button);
    });
}

// Initialize the story
function startGame() {
    displayStory("start");
}

// Start the game when the page loads
window.onload = startGame;
