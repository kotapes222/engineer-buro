import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'kotapes222/engineer-buro',
    branchPrefix: 'keystatic/',
  },
  singletons: {
    // Настройки сайта
    settings: singleton({
      label: 'Настройки сайта',
      path: 'content/settings',
      format: { data: 'json' },
      schema: {
        company_name: fields.text({
          label: 'Название компании',
          validation: { isRequired: true },
        }),
        phone: fields.text({
          label: 'Телефон',
        }),
        email: fields.text({
          label: 'Email',
        }),
        address: fields.text({
          label: 'Адрес',
        }),
      },
    }),
    // Hero секция
    hero: singleton({
      label: 'Главный баннер',
      path: 'content/hero',
      format: { data: 'json' },
      schema: {
        badge: fields.text({
          label: 'Бейдж',
        }),
        title_line1: fields.text({
          label: 'Заголовок (первая строка)',
          validation: { isRequired: true },
        }),
        title_line2: fields.text({
          label: 'Заголовок (вторая строка)',
        }),
        subtitle: fields.text({
          label: 'Подзаголовок',
          multiline: true,
        }),
      },
    }),
    // О компании
    about: singleton({
      label: 'О компании',
      path: 'content/about',
      format: { data: 'json' },
      schema: {
        title: fields.text({
          label: 'Заголовок',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Описание',
          multiline: true,
        }),
        image1: fields.image({
          label: 'Изображение 1',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        image2: fields.image({
          label: 'Изображение 2',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        features: fields.array(
          fields.object({
            text: fields.text({ label: 'Текст преимущества' }),
          }),
          {
            label: 'Преимущества',
            itemLabel: (props) => props.fields.text.value || 'Преимущество',
          }
        ),
      },
    }),
  },
  collections: {
    // Услуги
    services: collection({
      label: 'Услуги',
      slugField: 'title',
      path: 'content/services/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: { label: 'Название' },
        }),
        order: fields.integer({
          label: 'Порядок',
          defaultValue: 1,
        }),
        icon: fields.text({
          label: 'Иконка (emoji)',
          defaultValue: '✅',
        }),
        excerpt: fields.text({
          label: 'Краткое описание',
          description: 'Краткий текст для превью услуги',
          multiline: true,
        }),
        description: fields.text({
          label: 'Описание услуги',
          description: 'Вводный абзац о услуге',
          multiline: true,
        }),
        sections: fields.array(
          fields.object({
            title: fields.text({ 
              label: 'Заголовок раздела',
              description: 'Например: "Наши услуги", "Этапы работы"',
            }),
            isNumbered: fields.checkbox({
              label: 'Нумерованный список',
              defaultValue: false,
            }),
            items: fields.array(
              fields.text({ label: 'Пункт' }),
              {
                label: 'Пункты списка',
                itemLabel: (props) => props.value || 'Новый пункт',
              }
            ),
          }),
          {
            label: 'Разделы контента',
            itemLabel: (props) => props.fields.title.value || 'Новый раздел',
          }
        ),
      },
    }),
    // Проекты
    projects: collection({
      label: 'Проекты',
      slugField: 'title',
      path: 'content/projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: { label: 'Название' },
        }),
        image: fields.image({
          label: 'Изображение',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        category: fields.select({
          label: 'Категория',
          options: [
            { label: 'Вентиляция', value: 'ventilation' },
            { label: 'Технадзор', value: 'supervision' },
            { label: 'Проектирование', value: 'design' },
            { label: 'Реконструкция', value: 'reconstruction' },
          ],
          defaultValue: 'supervision',
        }),
        area: fields.text({
          label: 'Площадь/Характеристика',
        }),
        year: fields.text({
          label: 'Год',
        }),
        description: fields.text({
          label: 'Описание',
          multiline: true,
        }),
      },
    }),
  },
});
