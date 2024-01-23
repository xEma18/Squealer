<template>
    <div class="char-interface box">
      <h3 class="title is-5">Characters Counter: Public Mode</h3>
      <div class="char-count">
        <p>Daily characters used: <span>{{ dailyCharsUsed }}/{{ dailyCharLimit }}</span></p>
        <progress class="progress is-small is-primary" :value="dailyCharsUsed" :max="dailyCharLimit"></progress>
        <p>Weekly characters used: <span>{{ weeklyCharsUsed }}/{{ weeklyCharLimit }}</span></p>
        <progress class="progress is-small is-link" :value="weeklyCharsUsed" :max="weeklyCharLimit"></progress>
        <p>Monthly characters used: <span>{{ monthlyCharsUsed }}/{{ monthlyCharLimit }}</span></p>
        <progress class="progress is-small is-info" :value="monthlyCharsUsed" :max="monthlyCharLimit"></progress>
      </div>
        <div class="button-container">
            <button class="button is-right is-warning is-rounded">Not enough? Buy it!</button>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      dailyCharsUsed: Number,
      weeklyCharsUsed: Number,
      monthlyCharsUsed: Number,
      dailyCharLimit: Number,
      weeklyCharLimit: Number,
      monthlyCharLimit: Number
    }
  };
  </script>
  
  <style scoped>
  .char-interface {
  background-color: #ffffff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 5px;
  border: 1px solid #9a9a9a; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  
}

  
  .char-interface .char-count p {
    color: #363636;
    font-size: 0.9rem;
  }
  
  .char-interface .char-count span {
    font-weight: bold;
    color: #5B3C1D;
  }
  
  .progress.is-primary {
    background-color: #DBB77C;
  }
  
  .button.is-warning {
    background-color: #DBB77C;
    color: #5B3C1D;
  }

  .button-container {
    text-align: right;
    margin-top: 1%;
  }
  
  .button.is-warning:hover {
    background-color: #c19a6b;
  }
  </style>
  