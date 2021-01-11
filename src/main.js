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
		bcAPIURL: '',
		hr : [],
		todos: [],
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
		try {
			this.hr = JSON.parse(s);
		} catch (error) {}

		// and if not, then load default false values
		if ( ! this.hr.length ) {
			this.hr= [];
			for (var i=1; i<=40; i++) {
				this.hr.push(false);
			}
		}
		
		// figure out dates on a loop, every hour so that upon a new day, it detects it soon enough
		setTimeout(this.figureOutDates,1000*60*60)
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
			var todos = JSON.parse( localStorage.getItem('todos') );
			// remove todos that are beyond this week
			for(var i=0; i<todos.length; i++) {
				if ( todos[i].due_on <= this.weekEnd ) {
					this.todos.push(todos[i]);
				}
			}
		},
		toggleHour: function(n) {
			// let Vue be made aware of array update explicitly, so that UI can reflect
			Vue.set(this.hr, n, ! this.hr[n]);
			// save in localStorage
			localStorage.setItem('savedHours',JSON.stringify(this.hr));
		},
		toggleTodo: function(id) {
			for(var i=0;i<this.todos.length;i++){
				if ( id == this.todos[i].id ) {
					this.todos[i].completed = ! this.todos[i].completed;
				}
			}
			// save in localStorage
			localStorage.setItem('todos',JSON.stringify(this.todos));
		}
	}
});