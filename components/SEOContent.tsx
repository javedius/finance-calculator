export default function SEOContent() {
  return (
    <div className="space-y-8 mt-12">
      {/* Основной контент для SEO */}
      <section className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Финансовые калькуляторы онлайн - быстрые и точные расчеты
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Наш финансовый калькулятор предоставляет полный набор инструментов для расчета налогов, 
            кредитов, ипотеки и других финансовых операций. Все расчеты выполняются по актуальным 
            ставкам и формулам, действующим в Российской Федерации.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Популярные калькуляторы
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li><strong>НДФЛ калькулятор</strong> - расчет подоходного налога по прогрессивной шкале</li>
            <li><strong>Ипотечный калькулятор</strong> - ежемесячные платежи и досрочные погашения</li>
            <li><strong>Кредитный калькулятор</strong> - расчет потребительских и автокредитов</li>
            <li><strong>Страховые взносы</strong> - расчет взносов в ПФР, ФСС, ФФОМС</li>
            <li><strong>Налоги на имущество</strong> - транспортный, земельный, имущественный налоги</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Преимущества наших калькуляторов
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Актуальные ставки и формулы 2024 года</li>
            <li>Быстрые расчеты без регистрации</li>
            <li>Безопасность - данные не сохраняются</li>
            <li>Мобильная версия для всех устройств</li>
            <li>Подробные объяснения результатов</li>
          </ul>
        </div>
      </section>

      {/* FAQ секция */}
      <section className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Часто задаваемые вопросы
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Как пользоваться финансовым калькулятором?
            </h3>
            <p className="text-gray-600">
              Выберите нужный калькулятор из списка, введите ваши данные в соответствующие поля 
              и нажмите кнопку "Рассчитать". Результат появится мгновенно с подробным объяснением.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Актуальны ли ставки в калькуляторах?
            </h3>
            <p className="text-gray-600">
              Да, все ставки и формулы регулярно обновляются в соответствии с изменениями 
              в налоговом законодательстве и банковских условиях.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Безопасно ли вводить свои данные?
            </h3>
            <p className="text-gray-600">
              Абсолютно безопасно. Все расчеты выполняются локально в вашем браузере. 
              Ваши данные не передаются на сервер и не сохраняются.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Можно ли использовать калькуляторы на мобильном устройстве?
            </h3>
            <p className="text-gray-600">
              Да, все калькуляторы адаптированы для мобильных устройств и работают 
              на смартфонах и планшетах.
            </p>
          </div>
        </div>
      </section>

      {/* Дополнительная информация */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Финансовое планирование с нашими калькуляторами
        </h2>
        <p className="text-gray-600 mb-4">
          Правильное финансовое планирование начинается с понимания ваших налоговых обязательств 
          и возможностей по кредитованию. Наши калькуляторы помогут вам:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Спланировать бюджет с учетом налогов</li>
          <li>Выбрать оптимальные условия кредитования</li>
          <li>Рассчитать выгоду от досрочного погашения</li>
          <li>Оценить размер пенсионных накоплений</li>
          <li>Сравнить различные финансовые продукты</li>
        </ul>
      </section>
    </div>
  )
}
