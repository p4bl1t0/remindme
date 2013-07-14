// Insert your Dropbox app key here:
var DROPBOX_APP_KEY = 'rgvoh12bwuk0ye3';

// Exposed for easy access in the browser console.
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var taskTable;
var _taskList = $('#tasks');
var _taskNameInput = $('#task-name');
var _taskWhenInput = $('#task-when');
var beep = new Audio();
beep.setAttribute("src","sounds/reminder.mp3");
beep.load();

function authorizeNotification() {
    Notification.requestPermission(function(perm) {
        console.log(perm);
    });
}
function showNotification(text) {
    var notification = new Notification("This is a title", {
        dir: "auto",
        lang: "",
        body: text,
        tag: "sometag",
    });

    // notification.onclose =
    // notification.onshow =
    // notification.onerror =
}
authorizeNotification();
showNotification("remind me iniciado");

$(function () {
	// Insert a new task record into the table.
	function insertTask(text, date) {
		taskTable.insert({
			taskname: text,
            taskwhen: date,
			created: new Date(),
			completed: false
		});
	}
    setInterval(function() {
        var records = taskTable.query();
        records.sort(function (taskA, taskB) {
			if (taskA.get('taskwhen') < taskB.get('taskwhen')) return -1;
			if (taskA.get('taskwhen') > taskB.get('taskwhen')) return 1;
			return 0;
		});
        for (var i = 0; i < records.length; i++) {
			var record = records[i];
			if(record.get('taskwhen') < new Date() && record.get('taskwhen') > new Date((new Date()).getTime() - 0.5*60000) /*&& !record.get('completed')*/) {
                console.log("notify" + " " + record.get('taskname') );
                beep.play();
                showNotification(record.get('taskname'));
            } else {
                /*if(record.get('taskwhen') > new Date()) {
                    break; //termino
                }*/
            }
		}
        
    }, 1000 * 15); //Cada 15 segundos chequeo si una tarea venció
	// updateList will be called every time the table changes.
	function updateList() {
		_taskList.empty();

		var records = taskTable.query();

		// Sort by creation time.
		records.sort(function (taskA, taskB) {
			if (taskA.get('created') < taskB.get('created')) return -1;
			if (taskA.get('created') > taskB.get('created')) return 1;
			return 0;
		});

		// Add an item to the list for each task.
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			_taskList.append(
				renderTask(record.getId(),
					record.get('completed'),
					record.get('taskname'),
                    record.get('taskwhen')     
                    ));
		}

		addListeners();
		_taskNameInput.focus();
        var date = new Date((new Date()).getTime() + 2*60000); //2 = 2 minutos
        _taskWhenInput.val(date.toString());
	}

	// The login button will start the authentication process.
	$('#loginButton').click(function (e) {
		e.preventDefault();
		// This will redirect the browser to OAuth login.
		client.authenticate();
	});

	// Try to finish OAuth authorization.
	client.authenticate({interactive:false}, function (error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});

	if (client.isAuthenticated()) {
		// Client is authenticated. Display UI.
		$('#loginButton').hide();
		$('#main').show();

		client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}

			taskTable = datastore.getTable('tasks');

			// Populate the initial task list.
			updateList();

			// Ensure that future changes update the list.
			datastore.recordsChanged.addListener(updateList);
		});
	}

	// Set the completed status of a task with the given ID.
	function setCompleted(id, completed) {
		taskTable.get(id).set('completed', completed);
	}

	// Delete the record with a given ID.
	function deleteRecord(id) {
		taskTable.get(id).deleteRecord();
	}

	// Render the HTML for a single task.
	function renderTask(id, completed, text, when) {
		return $('<li>').attr('id', id).append(
				$('<button>').addClass('delete').html('&times;')
			).append(
				$('<span>').append(
					$('<button>').addClass('checkbox').html('&#x2713;')
				).append(
					$('<span>').addClass('text').text(text + " - " + when)
				)
			)
			.addClass(completed ? 'completed' : '');
	}

	// Register event listeners to handle completing and deleting.
	function addListeners() {
		$('span').click(function (e) {
			e.preventDefault();
			var li = $(this).parents('li');
			var id = li.attr('id');
			setCompleted(id, !li.hasClass('completed'));
		});

		$('button.delete').click(function (e) {
			e.preventDefault();
			var id = $(this).parents('li').attr('id');
			deleteRecord(id);
		});
	}

	// Hook form submit and add the new task.
	$('#addForm').submit(function (e) {
		e.preventDefault();
		if (_taskNameInput.val().length > 0) {
            var date = new Date(_taskWhenInput.val());
			insertTask(_taskNameInput.val(), date);
			_taskNameInput.val('');
		}
		return false;
	});

	_taskNameInput.focus();
});