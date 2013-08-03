(function() {
    window.remindme = window.remindme || {};
    window.remindme.model = {};
    
    function Task (taskName, whenToDoIt, taskId, isCompleted, whenWasCreated) {
        this.id = 0;
        this.name = "";
        this.when = new Date();
        this.completed = false;
        this.created = new Date();
        if(taskId !== null && taskId !== undefined) {
            this.name = taskId;
        }
        if(taskName !== null && taskName !== undefined) {
            this.name = taskName;
        }
        if(whenToDoIt !== null && whenToDoIt !== undefined) {
            this.when = whenToDoIt;
        }
        if(isCompleted !== null && isCompleted !== undefined) {
            this.completed = isCompleted;
        }
        if(whenWasCreated !== null && whenWasCreated !== undefined) {
            this.created = whenWasCreated;
        }
    }
    
    Task.prototype.postpone = function (time) {
        if(time === null || time === undefined) {
            time = 2*60000; //Default: 2 minutes
        }
        this.when = new Date(this.when.getTime() + time);
    }
    
    window.remindme.model.Task = Task;
    
})();
