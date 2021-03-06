var debug = true;

new Vue({
	el: '#app',
	data: {
		days: [
			'mon',
			'tue',
			'wed',
			'thu',
			'fri',
			'sat',
			'sun',
		],
		currentDay: 0,
		weekStart: '',
		weekEnd: '',
		bcAPIURL: '', // simply shown as a link in UI
		hr : [],
		todos: [],
		documentTitle: '',
		year: 2021
	},
	beforeMount: function() {
		this.figureOutDates();

		this.bcAPIURL = 'https://basecamp.com/2626524/api/v1/projects/11781410/todos.json?due_since=' + this.weekStart;

		// load basecamp todos
		this.loadBasecampTodos();

		// 40hrs focus hrs commitment
		// see if we have info saved in localStorage first
		var s = localStorage.getItem('savedHours');
		if (s) {
			try {
				this.hr = JSON.parse(s);
			} catch (error) {}
		} else {
			for (var i=1; i<=40; i++) {
				this.hr.push(false);
			}
		}
		
		// figure out dates on a loop, every 5 mins so that upon a new day, it detects it quick enough
		setInterval(this.figureOutDates,5*60*1000)

		// for showing protected hours in title bar
		this.documentTitle = document.title;
		this.updateTitle();
	},
	filters: {
		firstAlphabetOfDay: function(value) {
			return value.substring(0,1);
		}
	},
	methods: {
		figureOutDates: function() {
			var today = new Date();
			this.currentDay = ( new Date().getDay() ) - 1; // match with index in days array
			if ( this.currentDay == -1 ) {
				this.currentDay = 6; // sunday
			}
			this.weekStart = today.getFullYear() + '-' + ('0' +  (today.getMonth() + 1)).slice(-2) + '-' + ( '0' + ( today.getDate() - this.currentDay ) ).slice(-2);
			this.weekEnd = today.getFullYear() + '-' + ('0' +  (today.getMonth() + 1)).slice(-2) + '-' + ( '0' + ( today.getDate() - this.currentDay + 6 ) ).slice(-2);
	
			if (debug) {
				console.log( 'week start:',this.weekStart,' week end:', this.weekEnd );
			}
		},
		loadBasecampTodos: function() {
			try {
				var todos = JSON.parse( localStorage.getItem('todos') );
			} catch (error) {}

			// don't care about todos that are beyond this week
			if (todos) {
				for(var i=0; i<todos.length; i++) {
					if ( todos[i].due_on && todos[i].due_on <= this.weekEnd ) {
						this.todos.push(todos[i]);
					}
				}
			} else {
				// load some defaults for demo
				console.log('loading sample tasks for demo');
				this.todos = JSON.parse( '[{ "id": 1, "content": "Launch rocket", "completed": false }, { "id": 2, "content": "Short Banks", "completed": true }, { "id": 3, "content": "Buy Bitcoin", "completed": true }]' );
				// create empty entry in localStorage for easy edit
				localStorage.setItem('todos','');
			}
		},
		updateTitle: function() {
			var protectedHours = 0;
			for(var i=0;i<this.hr.length;i++){
				if ( this.hr[i] ) {
					protectedHours++;
				}
			}

			document.title = this.documentTitle + ' (' + protectedHours + ')';
		},
		toggleHour: function(n) {
			// let Vue be made aware of array update explicitly, so that UI can reflect
			Vue.set(this.hr, n, ! this.hr[n]);
			// save in localStorage
			localStorage.setItem('savedHours',JSON.stringify(this.hr));

			this.updateTitle();
		},
		toggleTodo: function(id) {
			for(var i=0;i<this.todos.length;i++){
				if ( id == this.todos[i].id ) {
					this.todos[i].completed = ! this.todos[i].completed;
				}
			}
			// save in localStorage
			localStorage.setItem('todos',JSON.stringify(this.todos));

			this.updateTitle();
		}
	}
});