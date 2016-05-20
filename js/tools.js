var sliderPeriod    = 5000;
var sliderTimer     = null;

(function($) {

    $(document).ready(function() {

        $('.logo a, .footer-logo a').click(function(e) {
            $.scrollTo(0, 500);

            e.preventDefault();
        });

        $('nav ul a, .footer-menu a').click(function(e) {
            var curBlock = $(this).attr('href');
            if ($(curBlock).length > 0) {
                $.scrollTo($(curBlock), 500, {offset: {'top': -100}});
            }

            e.preventDefault();
        });

        $('#slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            var curHTML = '';
            curSlider.find('.slider-content li').each(function() {
                curHTML += '<a href="#"></a>';
            });
            $('.slider-ctrl').html(curHTML);
            $('.slider-ctrl a:first').addClass('active');
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        });

        function sliderNext() {
            var curSlider = $('#slider');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex >= curSlider.find('.slider-content li').length) {
                    newIndex = 0;
                }

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1}).show();

                curSlider.find('.slider-ctrl a.active').removeClass('active');
                curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                    curSlider.data('disableAnimation', true);
                    sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                });
            }
        }

        $('#slider').on('click', '.slider-ctrl a', function(e) {
            if (!$(this).hasClass('active')) {
                window.clearTimeout(sliderTimer);
                sliderTimer = null;

                var curSlider = $('#slider');
                if (curSlider.data('disableAnimation')) {
                    curSlider.find('.slider-content li.played').removeClass('played');
                    curSlider.find('iframe').remove();

                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.slider-ctrl a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1}).show();

                    curSlider.find('.slider-ctrl a.active').removeClass('active');
                    curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                    curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    });
                }
            }

            e.preventDefault();
        });

        $('.slider-play').click(function(e) {
            window.clearTimeout(sliderTimer);
            sliderTimer = null;

            var curLink = $(this);
            var curItem = $(this).parent().parent();
            curItem.addClass('played');
            curItem.append('<iframe src="' + curLink.attr('href') + '?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');

            e.preventDefault();
        });

        $('body').on('click', '.events-item-info-address-more', function(e) {
            $(this).parent().toggleClass('open');
            e.preventDefault();
        });

        $('body').on('click', '.events-item-detail-link a', function(e) {
            var curLink = $(this);
            var curText = curLink.html();
            curLink.html(curLink.data('alttext'));
            curLink.data('alttext', curText);
            curLink.parents().filter('.window-events-item-wrap').toggleClass('open');
            e.preventDefault();
        });

        $('body').on('click', '.events-item-detail-close a', function(e) {
            $(this).parents().filter('.window-events-item-wrap').find('.events-item-detail-link a').click();
            e.preventDefault();
        });

        $('#events').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
        });

        $('#events').on('click', '.events-ctrl a', function(e) {
            if (!$(this).hasClass('active')) {

                var curSlider = $('#events');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.events-ctrl a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.events-item').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.events-item').eq(newIndex).css({'z-index': 1}).show();

                    curSlider.find('.events-ctrl a.active').removeClass('active');
                    curSlider.find('.events-ctrl a').eq(newIndex).addClass('active');

                    curSlider.find('.events-item').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                    });
                }
            }

            e.preventDefault();
        });

        $('.portfolio-menu a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.portfolio-menu li.active').removeClass('active');
                curLi.addClass('active');
                $('.portfolio-list').isotope({
                    filter: $('.portfolio-menu li.active a').data('filter')
                });
            }
            e.preventDefault();
        });

        $('.portfolio-list').isotope({
            itemSelector: '.portfolio-item',
            filter: $('.portfolio-menu li.active a').data('filter'),
            masonry: {
                columnWidth: 160
            }
        });

        $('.portfolio-more a').click(function(e) {
            $('.portfolio-loading').show();
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.portfolio-loading').hide();
                var $items = $(html);
                $('.portfolio-list').append($items).isotope('appended', $items);
            });
            e.preventDefault();
        });

        $(document).on('click', '.portfolio-item a', function(e) {
            var curItem = $(this).parents().filter('.portfolio-item');
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);

                $('.window-content').append(
                    '<a href="#" class="project-prev"><div>Предыдущий проект</div><span></span></a>' +
                    '<a href="#" class="project-next"><div>Следующий проект</div><span></span></a>'
                );


                var curIndex = $('.portfolio-list .portfolio-item').index(curItem);
                var prevIndex = curIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = $('.portfolio-list .portfolio-item').length - 1;
                }
                while ($('.portfolio-list .portfolio-item').eq(prevIndex).css('display') != 'block' && prevIndex != curIndex) {
                    prevIndex--;
                    if (prevIndex < 0) {
                        prevIndex = $('.portfolio-list .portfolio-item').length - 1;
                    }
                }
                var nextIndex = curIndex + 1;
                if (nextIndex > $('.portfolio-list .portfolio-item').length - 1) {
                    nextIndex = 0;
                }
                while ($('.portfolio-list .portfolio-item').eq(nextIndex).css('display') != 'block' && nextIndex != curIndex) {
                    nextIndex++;
                    if (nextIndex > $('.portfolio-list .portfolio-item').length - 1) {
                        nextIndex = 0;
                    }
                }
                if ($('.portfolio-list .portfolio-item').eq(prevIndex).css('display') == 'block') {
                    $('.project-prev').data('curIndex', prevIndex);
                    $('.project-prev span').html($('.portfolio-list .portfolio-item').eq(prevIndex).find('a').attr('title'));
                } else {
                    $('.project-prev').hide();
                }
                if ($('.portfolio-list .portfolio-item').eq(nextIndex).css('display') == 'block') {
                    $('.project-next').data('curIndex', nextIndex);
                    $('.project-next span').html($('.portfolio-list .portfolio-item').eq(nextIndex).find('a').attr('title'));
                } else {
                    $('.project-next').hide();
                }
            });
            e.preventDefault();
        });

        $(document).on('click', '.project-prev, .project-next', function(e) {
            $('.portfolio-list .portfolio-item').eq($(this).data('curIndex')).find('a').trigger('click');
            e.preventDefault();
        });

        $('input.maskPhone').mask('+7 999 999-99-99');

        $.extend($.validator.messages, {
            required: 'Не заполнено поле',
            email: 'Введен некорректный e-mail'
        });

        $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

        $('.form-checkbox span input:checked').parent().parent().addClass('checked');
        $('.form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        $('.form-radio span input:checked').parent().parent().addClass('checked');
        $('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('form').each(function() {
            if ($(this).hasClass('ajaxForm') && !$(this).hasClass('isLoading')) {
                $(this).validate({
                    ignore: '',
                    invalidHandler: function(form, validatorcalc) {
                        validatorcalc.showErrors();
                    },
                    submitHandler: function(form) {
                        $(form).addClass('isLoading');
                        $(form).find('.form-submit').append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                        $.ajax({
                            type: 'POST',
                            url: $(form).attr('action'),
                            data: $(form).serialize(),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            $(form).find('.loading').remove();
                            $(form).removeClass('isLoading');
                            $(form).append(html);
                        });
                    }
                });
            } else {
                $(this).validate({
                    ignore: '',
                    invalidHandler: function(form, validatorcalc) {
                        validatorcalc.showErrors();
                    }
                });
            }
        });

        $('.form-file input').change(function() {
            $(this).parent().find('span').html($(this).val().replace(/.*(\/|\\)/, ''));
        });

        $('.events-archive, .services-item-link a, .subscribe-link a, .header-ok a').click(function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

    });

    $(window).bind('load resize scroll', function() {
        var curScroll = $(window).scrollTop();
        var curHeight = $(window).height() / 2;
        $('nav ul a').each(function() {
            var curBlock = $(this).attr('href');
            if ($(curBlock).length > 0 && $(curBlock).offset().top < (curScroll + curHeight)) {
                $('nav ul li.active').removeClass('active');
                $(this).parent().addClass('active');
            }
        });

        if (curScroll > 0) {
            $('.wrapper').addClass('fixed');
        } else {
            $('.wrapper').removeClass('fixed');
        }
    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        $(window).scrollTop(0);
        $('.wrapper').css({'margin-top': -curScrollTop});
        $('.wrapper').data('scrollTop', curScrollTop);

        $('body').append(   '<div class="window">' +
                                '<div class="window-container">' +
                                    '<div class="window-content">' +
                                        contentWindow +
                                        '<a href="#" class="window-close">Закрыть</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>')
        $('.window').each(function() {
            $(this).jScrollPane({
                autoReinitialise: true,
                showArrows: true
            });
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window input.maskPhone').mask('+7 999 999-99-99');

        $('.window .form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

        $('.window .form-checkbox span input:checked').parent().parent().addClass('checked');
        $('.window .form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        $('.window .form-radio span input:checked').parent().parent().addClass('checked');
        $('.window .form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.window .form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('.window form').each(function() {
            if ($(this).hasClass('ajaxForm') && !$(this).hasClass('isLoading')) {
                $(this).validate({
                    ignore: '',
                    invalidHandler: function(form, validatorcalc) {
                        validatorcalc.showErrors();
                    },
                    submitHandler: function(form) {
                        $(form).addClass('isLoading');
                        $(form).find('.form-submit').append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                        $.ajax({
                            type: 'POST',
                            url: $(form).attr('action'),
                            data: $(form).serialize(),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            $(form).find('.loading').remove();
                            $(form).removeClass('isLoading');
                            $(form).append(html);
                        });
                    }
                });
            } else {
                $(this).validate({
                    ignore: '',
                    invalidHandler: function(form, validatorcalc) {
                        validatorcalc.showErrors();
                    }
                });
            }
        });

        $('.window .form-file input').change(function() {
            $(this).parent().find('span').html($(this).val().replace(/.*(\/|\\)/, ''));
        });

    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('.wrapper').css({'margin-top': '0'});
        $('body').css({'height': '100%', 'overflow': 'visible'});
        $(window).scrollTop($('.wrapper').data('scrollTop'));
    }

})(jQuery);