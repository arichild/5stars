$(document).ready(function () {
  // popup
  $(document).on("click", ".mfp-link", function () {
    var a = $(this);
    var type = "ajax"; // По умолчанию используем ajax тип
    var src = a.attr("data-href");
    
    if (a.hasClass('mfp-gallery-image')) {
      type = "image";
    } else if (a.hasClass('mfp-gallery-video')) {
      type = "inline";
      src = '<div class="mfp-gallery-video-wrapper"><video src="' + src + '" controls autoplay></video></div>';
    }
  
    $.magnificPopup.open({
      items: {src: src},
      type: type,
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url",
      },
      image: {
        titleSrc: 'title' // Используем атрибут title для заголовка изображения, если он есть
      },
      callbacks: {
        open: function () {
          setTimeout(function () {
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          }, 700);
          document.documentElement.style.overflow = 'hidden';
        },
        close: function () {
          document.documentElement.style.overflow = '';
        }
      }
    });
    return false;
  });

  // validate
  $.validator.messages.required = 'Заполните поле';
  $.validator.messages.number = 'Тольцо цифры';
  $.validator.messages.email = 'Введите корректный email';

  jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^([а-яё ]+|[a-z ]+)$/i.test(value);
  }, "Поле может содержать только буквы");

  jQuery.validator.addMethod("phone", function (value, element) {
    if (value.startsWith('+375')) {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){12}(\s*)?$/i.test(value);
    } else if (value.startsWith('+7')) {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11}(\s*)?$/i.test(value);
    } else {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11,14}(\s*)?$/i.test(value);
    }
  }, "Введите полный номер");


  // imask
  function setPhoneMask() {
    let phone = document.querySelectorAll('.phone-mask')

    if (phone.length) {
      phone.forEach(element => {
        IMask(element, {
          mask: [
            {
              mask: '+{375} (00) 000 00 00',
              startsWith: '375',
              overwrite: true,
              lazy: false,
              placeholderChar: '_',
            },
            {
              mask: '+{7} (000) 000 00 00',
              startsWith: '7',
              overwrite: true,
              lazy: false,
              placeholderChar: '_',
            },
            {
              mask: '+0000000000000',
              startsWith: '',
              country: 'unknown'
            }
          ],

          dispatch: function (appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');

            return dynamicMasked.compiledMasks.find(function (m) {
              return number.indexOf(m.startsWith) === 0;
            });
          }
        })
      });
    }
  }

  function setCalendarMask() {
    let calendar = document.querySelectorAll('input.calendar')

    if (calendar.length) {
      calendar.forEach(element => {
        IMask(element, {
          mask: [
              {
                mask: Date,
                min: new Date(1990, 0, 1),
                // max: new Date(2020, 0, 1),
                lazy: false
              }
          ],
        })
      });
    }
  }

  setPhoneMask()
  setCalendarMask()

  // $('.input-file input[type=file]').on('change', function(){
  //   let file = this.files[0];
  //   $(this).next().html(file.name);
  // });

  const $burgerBtn = $('.burger-btn');
  const $burgerBtnIcon = $('.burger-btn span');
  const $headerNav = $('.header-links');

  $burgerBtn.on('click', function () {
    if ($burgerBtnIcon.length && $headerNav.length) {
      $burgerBtnIcon.toggleClass('active');
      $headerNav.toggleClass('active');
      $('.wrapper').toggleClass('non-scroll');
    }
  });

  $(document).on('change', '.input-file input[type=file]', function (event) {
    const input = event.target;

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      const parent = $(this).closest('.input-file');

      parent.find('span').hide();

      reader.onload = function (e) {
        parent.find('.preview').attr('src', e.target.result).show();
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

  $('.ui-select').styler({
    placeholder: function () {
      return $(this).find('option[disabled]:selected').text();
    }
  });

  $('.ui-checkbox').styler();

  $('.js-example-basic-multiple').select2({
    width: '100%',
  });

  $('select.ui-select').on('change', function () {
    setTimeout(function () {
      $('select.ui-select').trigger('refresh');
    }, 1)
  });

  function setCalendar(array) {
    array.forEach(element => {
      const parent = $(element).closest('span.calendar');
      const input = parent.find('input')
      const img = $(parent).find('img');

      jQuery(element).datetimepicker({
        format: "d.m.Y",
        formatDate: "d.m.Y",
        timepicker: false,
        scrollInput: false,
        lang: "ru",
        // mask: '99.99.9999',

        onClose: function () {
          $(element).valid()
        },

        onGenerate: function () {
          const calendar = $(this)

          img.on("click", function () {
            calendar.removeClass('hide')
            input.datetimepicker('show')
          });

          input.on("click", function () {
            calendar.addClass('hide')
          });
        }
      });
    });

    $.datetimepicker.setLocale("ru");
  }

  const allCalendar = document.querySelectorAll('input.calendar')

  if (allCalendar.length) {
    setCalendar(allCalendar)
  }

  let counter = document.querySelectorAll('.trainer-list > div').length

  // добавление тренера
  $(document).on('click', '.add-coach', function (event) {
    event.preventDefault()

    $('.ui-select').styler('destroy');

    const originalWhiteBlock = $('.white-block').last();
    const newWhiteBlock = originalWhiteBlock.clone();

    counter++;

    // обновляем id и name
    newWhiteBlock.find('[data-name]').each(function () {
      const dataNameValue = $(this).attr('data-name');

      if ($(this).attr('id')) {
        const newId = $(this).attr('id') + counter;
        $(this).attr('id', newId);
      }

      if ($(this).attr('name')) {
          if (dataNameValue.includes('t[')) {
            const index = '[' + dataNameValue.split('t[')[1].split(']')[0] + ']';
            let newName = dataNameValue;
            $(this).attr('name', newName.replace('t' + index, `t[${counter + 1}]`));
            $(this).attr('data-name', newName.replace('t' + index, `t[${counter + 1}]`));
          } else {
            const newName = dataNameValue + (counter + 1);
            $(this).attr('name', newName);
          }
      }
    });

    newWhiteBlock.find('[data-id]').remove()

    // для валидации добавляем required и очищаем поля
    newWhiteBlock.find('input.ui-input, select.ui-input').each(function () {
      $(this).val('');
      $(this).prop('required', true);
    });

    // удаляем все добавленные блоки с группой и отображаем кнопку
    newWhiteBlock.find('.ui-btn.hidden').removeClass('hidden');
    newWhiteBlock.find('.white-block-container.new').each(function () {
      $(this).remove()
    });

    newWhiteBlock.find('.input-file input[type="file"]').val('');
    newWhiteBlock.find('.input-file input[type="file"]').attr('required', true);
    newWhiteBlock.find('.input-file .preview').attr('src', '');
    newWhiteBlock.find('.input-file .preview').css('display', 'none');
    newWhiteBlock.find('.input-file span').show();

    originalWhiteBlock.after(newWhiteBlock);

    // добавляем кнопку удалить
    if (!$('.ui-btn.delete-coach').length) {
      const deleteButton = $('<button class="ui-btn red small delete-coach">Удалить</button>');
      newWhiteBlock.find('.white-block-header').append(deleteButton);
    }

    // инициализация новых календарей
    const allNewCalendar = document.querySelectorAll('input.calendar')
    setCalendar(allNewCalendar)

    // Валидация для новых полей
    $("input[data-validation], select[data-validation]").each(function () {
      var validationTypes = $(this).data("validation");

      if (validationTypes === 'lettersonly') {
        $(this).rules('add', {
          lettersonly: true
        });
      }

      if (validationTypes === 'phone') {
        $(this).rules('add', {
          phone: true
        });
      }

      if (validationTypes === 'number') {
        $(this).rules('add', {
          number: true
        });
      }
    });

    // маска для телефона
    setPhoneMask()

    // стайлер селектов
    $('.ui-select').styler({
      // selectPlaceholder: ""
    });

    // для валидации
    $('select.ui-select').on('change', function () {
      setTimeout(function () {
        $('select.ui-select').trigger('refresh');
      }, 1)
    });
  });

  let counterGroup = 0;

  // добавление группы
  $(document).on('click', '.add-group', function (event) {
      event.preventDefault();
      $('.ui-select').styler('destroy');

      counterGroup++

      const container = $(this).closest('.white-block-container')
      const newContainer = container.clone();
      const deleteField = newContainer.find('.delete-column')

      newContainer.removeClass('group').addClass('new');
      newContainer.find('.field-delete').remove();

      // обновляем id и name
      newContainer.find('[data-name]').each(function () {
          const dataNameValue = $(this).attr('data-name');

          $.each($(this).find('[selected]'), function (e, i) {
              $(this).removeAttr('selected')
          })

          if ($(this).attr('id')) {
              const newId = $(this).attr('id') + counterGroup;
              $(this).attr('id', newId);
          }

          if ($(this).attr('name')) {
              const index = dataNameValue.split('[groups]')[1].split(']')[0] + ']';
              let newName = dataNameValue;
              $(this).attr('name', newName.replace('[groups]' + index, `[groups][${counterGroup + 1}]`));
              $(this).attr('data-name', newName.replace('[groups]' + index, `[groups][${counterGroup + 1}]`));
          }
      });


      newContainer.find('[data-gr-id]').remove()

      // для валидации добавляем required
      newContainer.find('select.ui-input').each(function () {
          $(this).prop('required', true);
      });

      // добавляем кнопку удаления
      const btnDelete = $(`
    <div class="ui-btn red small delete-group">Удалить</div>
  `);

      if (!newContainer.find('.ui-btn.delete-group').length) {
          deleteField.append(btnDelete);
      }

      container.after(newContainer);

      // скрываем кнопку
      $(this).addClass('hidden');

      // стайлер селектов
      $('.ui-select').styler({
          // selectPlaceholder: ""
      });

      // для валидации
      $('select.ui-select').on('change', function () {
          setTimeout(function () {
              $('select.ui-select').trigger('refresh');
          }, 1)
      });
  });

  const existTrainers = document.querySelector('[name="exist-trainers"]')

  // удаление тренера
  $(document).on('click', '.ui-btn.delete-coach', function (event) {
      event.preventDefault()
      const idInput = $(this).closest('.white-block').find('[data-id]')
      if (existTrainers && idInput.length > 0) {
          const id = Number(idInput.val())
          let arr = JSON.parse(existTrainers.value)
          arr.splice(arr.indexOf(id))
          existTrainers.value = JSON.stringify(arr)
      }
      counter--;
      $(this).closest('.white-block').remove();
  });

  const existGroups = document.querySelector('[name="exist-groups"]')

  // удаление группы
  $(document).on('click', '.ui-btn.delete-group', function (event) {
      event.preventDefault();
      const currentContainer = $(this).closest('.white-block-container');
      const prevContainer = currentContainer.prev();
      const countContainer = $(this).closest('.white-block').find('.white-block-container.new')

      if (currentContainer.is(':last-child') || prevContainer.hasClass('group') && countContainer.length < 2) {
          prevContainer.find('.add-group').removeClass('hidden');
      }

      const idInput = $(this).closest('.white-block-container.new').find('[data-gr-id]')
      if (existGroups && idInput.length > 0) {
          const id = Number(idInput.val())
          let arr = JSON.parse(existGroups.value)
          arr.splice(arr.indexOf(id))
          existGroups.value = JSON.stringify(arr)
      }

      currentContainer.remove();
  });

  // выйти
  (function () {
      const disconnectIcons = document.querySelectorAll('.header-links-item__discottect');

      disconnectIcons.forEach(icon => {
          const disconnectElement = icon.querySelector('.header-links-disconnect');

          icon.addEventListener('click', (event) => {
              event.stopPropagation();
              disconnectElement.classList.toggle('hidden');
          });

          document.addEventListener('click', (event) => {
              if (!disconnectElement.contains(event.target)) {
                  disconnectElement.classList.add('hidden');
              }
          });
      });
  })();

  // сравнение результатов
  (function () {
      // Функция для обновления состояния зависимых select
      function updateDependentSelect(triggerSelect, dependentSelect) {
          if ($(triggerSelect).val()) {
              $(dependentSelect).prop('disabled', false).trigger('refresh');
          } else {
              $(dependentSelect).prop('disabled', true).val('').trigger('refresh');
          }
      }

      // Обработчик изменения select1
      $('#select1').on('change', function () {
          updateDependentSelect('#select1', '#select3');
      });

      // Обработчик изменения select2
      $('#select2').on('change', function () {
          updateDependentSelect('#select2', '#select4');
      });

      // Инициальное состояние
      updateDependentSelect('#select1', '#select3');
      updateDependentSelect('#select2', '#select4');
  })();

  (function () {
      function syncRowHeights() {
          const fixedRows = document.querySelectorAll('#fixedTable tr');
          const scrollRows = document.querySelectorAll('#scrollTable tr');

          fixedRows.forEach((row, index) => {
              const scrollRow = scrollRows[index];
              if (scrollRow) {
                  const fixedRowHeight = row.getBoundingClientRect().height;
                  const scrollRowHeight = scrollRow.getBoundingClientRect().height;
                  const maxHeight = Math.max(fixedRowHeight, scrollRowHeight);
                  row.style.height = `${maxHeight}px`;
                  scrollRow.style.height = `${maxHeight}px`;
              }
          });
      }

      window.addEventListener('load', syncRowHeights);
      window.addEventListener('resize', syncRowHeights);
  })();

  // скролл снизу и сверху блока
  (function () {
      const container = document.querySelector('.scroll-wrapper');
      const content = document.querySelector('.scroll-content');
      const scrollTop = document.querySelector('.scroll-top');
      const scrollBottom = document.querySelector('.scroll-bottom');

      if (!container || !content || !scrollTop || !scrollBottom) return;

      const scrollThumbTop = scrollTop.querySelector('.scroll-thumb');
      const scrollThumbBottom = scrollBottom.querySelector('.scroll-thumb');

      function updateScrollVisibility() {
          const scrollWidth = content.scrollWidth - content.offsetWidth;
          scrollTop.classList.toggle('visible', scrollWidth > 0);
          scrollBottom.classList.toggle('visible', scrollWidth > 0);
          content.classList.toggle('scroll-visibled', scrollWidth > 0);
      }

      function updateScrollThumb() {
          const scrollWidth = content.scrollWidth - content.offsetWidth;
          const scrollLeft = content.scrollLeft;
          const containerWidth = container.offsetWidth;
          const contentWidth = content.scrollWidth;
          const trackWidth = containerWidth / contentWidth * 100;
          const thumbWidth = Math.max(20, trackWidth);
          const thumbLeft = (scrollLeft / (contentWidth - containerWidth)) * (100 - thumbWidth);

          scrollThumbTop.style.width = `${thumbWidth}%`;
          scrollThumbTop.style.left = `${thumbLeft}%`;
          scrollThumbBottom.style.width = `${thumbWidth}%`;
          scrollThumbBottom.style.left = `${thumbLeft}%`;
      }

      function handleScrollThumbDrag(e, thumb) {
          const startX = e.clientX - thumb.offsetLeft;
          const scrollWidth = content.scrollWidth - content.offsetWidth;
          const containerWidth = container.offsetWidth;
          const contentWidth = content.scrollWidth;

          function moveThumb(e) {
              const x = e.clientX - startX;
              const trackWidth = thumb.parentElement.offsetWidth;
              const thumbWidth = thumb.offsetWidth;
              const maxLeft = trackWidth - thumbWidth;
              const left = Math.max(0, Math.min(maxLeft, x));
              const scrollLeft = (left / maxLeft) * (contentWidth - containerWidth);

              content.scrollLeft = scrollLeft;
              updateScrollThumb();
          }

          function stopMoveThumb() {
              document.removeEventListener('mousemove', moveThumb);
              document.removeEventListener('mouseup', stopMoveThumb);
          }

          document.addEventListener('mousemove', moveThumb);
          document.addEventListener('mouseup', stopMoveThumb);
      }

      function handleResize() {
          updateScrollVisibility();
          updateScrollThumb();
      }

      content.addEventListener('scroll', () => {
          updateScrollVisibility();
          updateScrollThumb();
      });

      scrollThumbTop.addEventListener('mousedown', (e) => handleScrollThumbDrag(e, scrollThumbTop));
      scrollThumbBottom.addEventListener('mousedown', (e) => handleScrollThumbDrag(e, scrollThumbBottom));

      window.addEventListener('resize', handleResize);

      updateScrollVisibility();
      updateScrollThumb();
  })();


  $('.registr-form').on('submit', function (e) {
      if (!$(this).valid())
          e.preventDefault()
  })


  const formStar = $('select.star-form')

  if (formStar.length > 0) {
      formStar.on('change', async function (e) {
          const params = new URLSearchParams({starId: $(this).val()}).toString();
          const res = await fetch(`/local/templates/5stars/ajax/get-rating.php?${params}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                  },
              }
          )
          const rating = await res.json()

          if (rating.status) {
              const stat = rating.rating
              let tasks = [stat.tasks.l, stat.tasks.d, stat.tasks.u]
              chartIndicators.config.data.datasets[0].data = tasks
              document.querySelectorAll('.ui-charts')[0].querySelectorAll('.chart-subtitle').forEach((el, i) => {
                  let t = tasks[i] ?? 0
                  el.innerText = t + ' показателей'
              })
              chartIndicators.update()

              let points = [stat.points.f, stat.points.l]
              pointsIndicators.config.data.datasets[0].data = points
              document.querySelectorAll('.ui-charts')[1].querySelectorAll('.chart-subtitle').forEach((el, i) => {
                  el.innerText = points[i] + ' баллов'
              })
              pointsIndicators.update()
          } else {
              console.error(rating.reason)
          }
      })
  }


  const resultNav = {
      index: 0,
      nav: document.querySelector('.result-nav'),
      next: {
          node: document.querySelector('.result-nav .next'),
          update: async (e) => {
              const index = resultNav.index
              if (resultNav.index === 5) resultNav.index = 0
              else resultNav.index++


              const isUpdate = await resultNav.update.data()
              console.log(isUpdate)


              if (isUpdate)
                  resultNav.update.title()
              else
                  resultNav.index = index
          }
      },
      prev: {
          node: document.querySelector('.result-nav .prev'),
          update: async (e) => {
              const index = resultNav.index
              if (resultNav.index === 0) resultNav.index = 5
              else resultNav.index--


              const isUpdate = await resultNav.update.data()
              console.log(isUpdate)


              if (isUpdate)
                  resultNav.update.title()
              else
                  resultNav.index = index
          }
      },
      title: document.querySelector('.white-block-title'),
      update: {
          title: () => {
              if (resultNav.index === 0) resultNav.title.innerText = 'все звезды'
              else resultNav.title.innerText = `${resultNav.index} звезда`
          },
          data: async () => {
              const params = new URLSearchParams({starIndex: resultNav.index}).toString();
              const res = await fetch(`/local/templates/5stars/ajax/get-result-page.php?${params}`, {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json;charset=utf-8'
                      },
                  }
              )
              const rating = await res.json()


              if (rating.status) {
                  document.getElementById('result-block').innerHTML = rating.resultBlock
                  document.getElementById('rating-table').innerHTML = rating.ratingTable
                  return true
              } else {
                  showAlert('error', rating.reason);
                  return false
              }
          },
      }
  }

if (resultNav && resultNav.next.node && resultNav.prev.node) {
  resultNav.next.node.addEventListener('click', e => resultNav.next.update(e))
  resultNav.prev.node.addEventListener('click', e => resultNav.prev.update(e))
}

//  alert
(function() {
  function showAlert(className, content) {
    const alert = document.querySelector('.ui-alert');

    if(!alert) return;

    if(className === 'success') { 
      alert.classList.remove('error');
      alert.classList.add('success');

      alert.querySelector('.ui-alert-content').textContent = content;

    }

    if(className === 'error') {
      alert.classList.remove('success');
      alert.classList.add('error');

      alert.querySelector('.ui-alert-content').textContent = content;
    }

    const close = document.querySelector('.ui-alert-close');

    if(close) {
      close.addEventListener('click', () => {
        alert.classList.remove('success');
        alert.classList.remove('error');
      })      
    }
  }

  const triggerSuccess =  document.querySelector('.trigger-alert.success');
  const triggerError =  document.querySelector('.trigger-alert.error');

  if(triggerSuccess && triggerError) {
    triggerSuccess.addEventListener('click', function() {
        showAlert('success', 'успешная отправка успешная отправка успешная отправка успешная отправка успешная отправка успешная отправка');
    });

    triggerError.addEventListener('click', function() {
        showAlert('error', 'неуспешная отправка');
    });
  } 

})();

  // Открытый ответ. Выставление баллов
  (function() {
    const pointsSelect = document.getElementById('points');
    const ownPointsInput = document.getElementById('own-points');

    if(!pointsSelect || !ownPointsInput) return;

    function updateOwnPointsState() {
      const selectedValue = $(pointsSelect).val();
      const isCustomValue = selectedValue === '-1';
      
      ownPointsInput.disabled = !isCustomValue;
      
      if (isCustomValue) {
        ownPointsInput.focus();
      }
    }

    $(pointsSelect).on('change', updateOwnPointsState);

    updateOwnPointsState();
  })();
 
});