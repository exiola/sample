///////////////////////////////////////////////////////////////////////////////////////
// load Javascript Libraries
(function (global) {

  var scriptLoader = {
    loadScript: function (url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.onload = function (e) {
        if (callback)callback(e);
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    load: function () {
      console.log('hello load');
      console.log(this);
      this.loadScript('//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js');
      libraries = [
        '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/rxjs/2.3.11/rx.js'
      ];
    }
  };

  if(!jQuery)
    scriptLoader.load();
})(window);

///////////////////////////////////////////////////////////////////////////////////////
// CPage
(function (global) {


  global.CPage = {
    tryCount: 1,
    MAX_MORE_TRY: 20,
    log: function (v) {
      console.log(v);
    },
    clickMore: function () {
      this.log('clickMore ' + this.tryCount);
      jQuery('.load-more-text').parents('button').get(0).click();
    },
    scrollDown: function () {
      this.log('scrolldown');
      window.scrollTo(0, document.body.scrollHeight);
    },
    isMoreLoading: function () {
      return !jQuery('.load-more-text').is(':visible');
    },

    repeatClickMore: function () {
      this.scrollDown();
      this.tryCount += 1;

      if (!this.isMoreLoading())
        this.clickMore();

      if (this.tryCount > this.MAX_MORE_TRY) {
        this.log('End more Page ');
        this.tryCount = 0;
        return;
      }

      setTimeout(function () {
        CPage.repeatClickMore();
      }, 1000);
    },

    findVideoInfos: function () {
      var array = jQuery('a.yt-uix-tile-link')
        .filter(function (idx, e) {
          return /watch\?v/.test(jQuery(this).attr('href'))
        }).toArray();
      var pairs = array.map(function (e) {
        var ROOT = 'http://www.youtube.com';
        var $a = jQuery(e);
        return [$a.text(), ROOT + $a.attr('href').replace(/&list=.*/, '').replace(/\t/g, ' ')];
      });
      return pairs;
    },


    array2dToTsv: function (array2d) {
      return array2d.map(function (i) {
        return i.join("\t")
      }).join("\n");
    },

    makeVideoInfoTsv: function () {
      var pairs = this.findVideoInfos()
      console.log('모두 ' + pairs.length + '개 비디오 정보를 찾았습니다. tsv 포멧을 출력합니다.');
      var text = this.array2dToTsv(pairs);
      console.log(text);
      console.log('모두 ' + pairs.length + '개 비디오 정보를 찾았습니다.');
    },

    more: function(){
      this.repeatClickMore();
    },

    info: function(){
      this.makeVideoInfoTsv();
    }
  }

  console.log('CPage.more(); 를 실행하면, 20개 까지 페이지를 더 정보를 부릅니다.');
  console.log('CPage.info(); 를 실행하면, 현재 페이지의 비디오 정보를 제목, 링크의 tsv 로 출력합니다.');

  //var videoInfos = CPage.makeVideoInfoTsv();
  //console.log(videoInfos);

})(window);
