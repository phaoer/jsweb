;
! function (win) {
    win.ajaxpolling = function (setting, limit, callback) {
        nowTimes = 1;
        limitTimes = limit.times;

        setting.success = setting.error = function (res) {
            callback.call({
                abort: function(){
                    nowTimes = limit.times + 1;
                }
            }, res);
        }

        setting.complete = function(){
            nowTimes++;

            if(nowTimes <= limit.times){
                setTimeout(function(){
                    $.ajax(setting);
                }, limit.interval);
            }
        }

        $.ajax(setting);
    };
}(window);