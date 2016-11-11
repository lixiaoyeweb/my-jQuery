(function () {
    /*{
     // ajax请求地址
     url: '',
     // http方法
     method: 'get',
     // 成功执行的函数
     success: function () {},
     // 失败时执行的函数
     error: function () {},
     // 往服务器发送的参数
     data: {a:1,b:2),
     // 是否为异步请求
     async: true
     }*/

    /**
     *
     * @param options 用户传过来的配置对象
     */
    function ajax(options) {
        // 如果参数不是一个对象,则抛出类型错误
        if (!tools.isType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }
        // step 1 获取ajax对象
        var xhr = tools.getXHR();
        // 判断是否为get系方法
        var isGET = /^get|head|delete$/ig;
        // 将参数格式化为请求参数的格式
        var data = tools.encodeDataToURIString(options.data);

        // 如果为get系方法 需要把data拼接到url中
        if (isGET.test(options.method) && data) {
            // 拼接之前 先判断url中是否含有问号
            // 如果有问号 说明当前url中存在请求参数.否则不存在请求参数
            var splitChar = /\?/.test(options.url) ? '&' : '?';
            options.url = options.url + splitChar + data;
            // 因为get系方法send方法不需要传参数,所以将data设置为null
            data = null;
        }
        // step 2 调用open方法
        xhr.open(options.method, options.url, options.async);

        // step 3 接收响应
        xhr.onreadystatechange = function () {
            // 判断http事务是否完成
            if (xhr.readyState === 4) {
                // 获取响应主体
                var responseText = xhr.responseText;
                // 判断状态码是否成功
                if (/^2\d{2}$/.test(xhr.status) || xhr.status === 304) {
                    // 把响应主体放到success中
                    options.success(responseText);
                } else if (/^[45]\d{2}$/.test(xhr.status)) {
                    options.error(responseText, xhr.status);
                }
            }
        };

        // step 4 发送http请求.
        xhr.send(data);
    }

    var tools = {
        /**
         * 利用惰性函数,实现获取当前浏览器最合适的ajax对象
         */
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }];
            var xhr = null;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    return xhr;
                } catch (ex) {
                }
            }
            // 如果逻辑走到此处 说明当前浏览器压根不支持ajax功能
            throw new ReferenceError('当前浏览器不支持ajax功能');
        })(),
        /**
         * 判断数据类型
         * @param data
         * @param type
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        },
        /**
         * 把参数格式化为请求参数的格式 key1=value1&key2=value2
         * @param data
         * @return {string}
         */
        encodeDataToURIString: function (data) {
            // 如果参数为字符串,直接返回即可.
            if (this.isType(data, 'String')) {
                return data;
            }
            // 如果参数为对象
            if (this.isType(data, 'Object')) {
                var arr = [];
                for (var n in data) {
                    // 跳过原型链上的属性
                    if (!data.hasOwnProperty(n)) continue;
                    // url中不能存在非英文字符,需要调用encodeURIComponent来格式化下非英文字符
                    arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
                }
                return arr.join('&');
            }
            if (this.isType(data, 'Undefined')) {
                return '';
            }
            return data.toString();
        }
    };
    this.ajax = ajax;
})();