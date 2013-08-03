(function() {
    if(window.jQuery !== undefined && window.remindme !== undefined && window.remindme.model !== undefined) {
        //var $ = jQuery;
        window.remindme.view = {};
        
        function render (obj) {
            if(obj instanceof remindme.model.Task) {
                var task = obj;
                return $('<li>').attr('id', task.id).append(
                    $('<button>').addClass('delete').html('&times;')
                ).append(
                    $('<span>').append(
                        $('<button>').addClass('checkbox').html('&#x2713;')
                    ).append(
                        $('<span>').addClass('text').text(task.name + " - " + task.when)
                    )
                )
                .addClass(task.completed ? 'completed' : '');
            }
        }
        
        remindme.view.render = render;
    }
    
})();
