/*
*   Game JS
*/

Vue.component('goal-select', {
  template: `
            <div>
                <form class="form-horizontal" v-on:submit.prevent="" v-if="seen">
                    
                    <div class="form-group">
                        <label for="topicSearch" class="col-sm-2 control-label">Choose a goal topic</label>
                        <div class="col-sm-10">
                            <input id="topicSearch" type="text" placeholder="Start typing to search for a topic..." autofocus="autofocus" autocomplete="off" class="form-control" v-model="topic">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">Topics</label>
                        <div class="col-sm-10">
                            <span v-if="topic == '' ">Start searching or select an example topic</span>
                            <ul>
                                <li v-for="item in topics" v-on:click.prevent.stop="goalPick(item)">
                                    <a href="#">{{ item }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">Examples</label>
                        <div class="col-sm-10">
                            <ul>
                                <li v-for="item in examples" v-on:click.prevent.stop="goalPick(item.title)">
                                    <a href="#">{{ item.title }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </form>

                <div class="" v-if="chosenGoal != '' ">
                    <div class="col-sm-10">
                        Chosen Goal: <span id="chosenGoal"><b>{{ chosenGoal }}</b></span>
                    </div>
                    <div class="col-sm-2"><img :src="goalImg" class="sideImage" v-if="goalImg != '' " /></div>
                </div>

            </div>
        `,
  data: function () {
    return {
        seen: true,
        topic: "",
        topics: [],
        examples: [],
        chosenGoal: "",
        goalImg: "",
    }
  },
  created: function () {
    var self = this;
    self.loadExamples();
  },
  watch: {
    // whenever the topic changes, this function will run
    topic: function (newTopic) {
      console.log("Waiting for typing to complete ... " + newTopic);
      //Execute delayed function
      this.findTopic();
    }
  },
  methods: {
    findTopic:
        _.debounce(function () {
                self = this;
                console.log("Searching for topic: " + self.topic);
                $.get("/api/query/" + self.topic)
                  .done(function(data) {
                    self.topics = data[1];
                  })
                  .fail(function() {
                    console.log("Error fetching topics");
                  });
            }, 500),
    goalPick: function(goal) {
        console.log("Choosing goal: " + goal);
        this.chosenGoal = goal;
        this.loadImage(goal);
        bus.$emit('randomStart:selectGoal');
        bus.$emit('gameRound:setGoal', goal);
        this.seen = false;
    },
    loadExamples: function() {
        var self = this;
        $.get("/api/random")
              .done(function(data) {
                self.examples = data.query.random;
              })
              .fail(function() {
                console.log("Error fetching examples");
              });
    },
    loadImage: function(topic) {
        var self = this;
        self.goalImg = "/img/undefined.png";
        $.get("/api/image/" + topic)
              .done(function(data) {
                if(data.original !== undefined) {
                  self.goalImg = data.original;
                }
              })
              .fail(function() {
                console.log("Error fetching image");
              });
    },
  },
});


Vue.component('random-start', {
  template: `
                <div v-if="seen">
                    <div class="col-sm-12" >
                        <span>Starting Topic: 
                            <i v-if="!topic">A random topic will be chosen when you start</i>
                            <b v-if="topic">{{ topic }}</b>
                        </span>
                    </div>

                    <div class="col-sm-12" >
                        <button class="btn btn-danger" v-on:click="startOver">Start Over</button>
                        <button class="btn btn-primary" v-on:click="findTopic" v-if="!topic">Let&rsquo;s Play</button>
                    </div>
                </div>
        `,
  data: function () {
    return {
        seen: false,
        topic: "",
        topics: [],
    };
  },
  created: function () {
    var self = this;
    //Bind Event Listener
    bus.$on('randomStart:selectGoal', function () {
        self.seen = true;
    });
  },
  methods: {
    findTopic: function () {
        var self = this;
        console.log("Fetching random topic ");

        $.get("/api/random")
          .done(function(data) {
            self.topics = data.query.random;
            //Pick a random topic
            self.topic = self.topics[Math.floor(Math.random()*self.topics.length)].title;
            bus.$emit('gameRound:selectTopic', self.topic);
            self.seen = true;
          })
          .fail(function() {
            console.log("Error fetching topics");
          });
    },
    startOver: function () {
        location.reload();
    },
  },
});


Vue.component('game-round', {
  template: `
                <div v-if="seen">

                    <div class="col-sm-10">Current Topic: <b>{{ topic }}</b></div>
                    <div class="col-sm-2"><img :src="topicImg" class="sideImage" v-if="topicImg != '' " /></div>

                    <div class="col-sm-12">Score: <b>{{ score }}</b></div>

                    <div class="col-sm-12">
                        <ul>
                            <li v-for="item in outgoingLinks" >
                                <a href="#" v-on:click.prevent.stop="choose(item.title)">{{ item.title }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
        `,
  data: function () {
    return {
        seen: false,
        score: 0,
        topic: "",
        topicImg: "",
        outgoingLinks: [],
        goal: "",
    };
  },
  created: function () {
    var self = this;
    //Bind Event Listener
    bus.$on('gameRound:selectTopic', function (topic) {
        self.choose(topic);
    });
    bus.$on('gameRound:setGoal', function (goal) {
        self.goal = goal;
    });
  },
  methods: {
    choose: function (topic) {
        var self = this;
        self.seen = true;
        console.log("Selecting topic: " + topic);
        self.topic = topic;

        var normalised = Utils.normalise(topic);

        //Check if this is a winning move
        if(self.contains(normalised, self.goal)) {
          bus.$emit('gameOver:win');
          console.log("Yay! You win.");
        }

        //Get outgoing links and display them
        self.getOutgoingLinks(normalised);
        self.loadImage(normalised);
        self.score++;
    },
    getOutgoingLinks: function (topic) {
        var self = this;

        $.get("/api/outgoing/" + topic)
          .done(function(data) {
            if (data.length === 0) {
                bus.$emit('gameOver:noLinks');
                console.log("Uh oh, page has no links!");
            }
            else {
                self.outgoingLinks = data;
            }
            
          })
          .fail(function() {
            console.log("Error fetching topics");
          });
    },
    contains: function(needle, haystack) {
      $.get("/api/contains/" + haystack + "/" + needle)
          .done(function(data) {
              return data.result;
          })
          .fail(function() {
            console.log("Error fetching topics");
            return false;
          });
    },
    loadImage: function(topic) {
        var self = this;
        self.topicImg = "/img/undefined.png";
        $.get("/api/image/" + topic)
              .done(function(data) {
                if(data.original !== undefined) {
                  self.topicImg = data.original;
                }
              })
              .fail(function() {
                console.log("Error fetching image");
              });
    },
  },
});


Vue.component('game-over', {
  template: `
            <div v-if="seen">
               <h1>Game Over</h1>

               <div class="col-sm-12"><b>{{ message }}</div>

               <div>
                  <button class="btn btn-danger" v-on:click="startOver">Start Again</button>
               </div>

            </div>
        `,
  data: function () {
    return {
        seen: false,
        message: "",
    };
  },
  created: function () {
    var self = this;
    //Bind Event Listener
    bus.$on('gameOver:noLinks', function () {
        self.seen = true;
        message = "There were no links left!";
    });
    bus.$on('gameOver:win', function () {
        self.seen = true;
        message = "Congratulations! You won.";
    });
  },
  methods: {
    startOver: function () {
        location.reload();
    },
  },
});



//Global Event Bus
var bus = new Vue();

var game = new Vue({
  el: '#game',
});


