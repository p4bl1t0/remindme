(function() {
    window.remindme = window.remindme || {};
    window.remindme.model = {};
    
    function Task (n, w) {
        this.id = 0;
        this.created = new Date();
        this.completed = false;
        this.name = "";
        if(n !== null && n !== undefined) {
            this.name = n;
        }
        this.when = new Date();
        if(w !== null && w !== undefined) {
            this.when = w;
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
