define([
    'uiComponent',
    'ko',
    'mage/url'
], function (Component, ko, url) {
    'use strict';

    return Component.extend({

        defaults: {
            template: 'Magento_Checkout/progress-bar',
        },

        steps: {
            cart: { completed: ko.observable(false), active: ko.observable(false) },
            shipping: { completed: ko.observable(false), active: ko.observable(false) },
            payment: { completed: ko.observable(false), active: ko.observable(false) },
            success: { completed: ko.observable(false), active: ko.observable(false) }
        },

        initialize: function () {
            this._super();
            this.setCurrentStep(); // Define o passo atual
            this.observePageChange(); // Observa mudanças na página
        },

        setCurrentStep: function () {
            var currentStep = this.getCurrentStepFromUrl();

            // Redefine todos os estados antes de definir o ativo e o completo
            for (var step in this.steps) {
                this.steps[step].completed(false);
                this.steps[step].active(false);

                if (step === currentStep) {
                    this.steps[step].active(true);
                } else if (this.isBeforeCurrentStep(step, currentStep)) {
                    this.steps[step].completed(true);
                }
            }
        },

        getCurrentStepFromUrl: function () {
            var currentUrl = window.location.href;

            if (currentUrl.includes('checkout/cart')) {
                return 'cart';
            } else if (currentUrl.includes('#shipping')) {
                return 'shipping';
            } else if (currentUrl.includes('#payment')) {
                return 'payment';
            } else if (currentUrl.includes('checkout/onepage/success')) {
                return 'success';
            }

            return 'cart';
        },

        isBeforeCurrentStep: function (step, currentStep) {
            var order = ['cart', 'shipping', 'payment', 'success'];
            return order.indexOf(step) < order.indexOf(currentStep);
        },

        observePageChange: function () {
            // Redefine a barra de progresso ao detectar mudança de hash ou popstate
            window.addEventListener('hashchange', this.setCurrentStep.bind(this));
            window.addEventListener('popstate', this.setCurrentStep.bind(this));
        },

        isStepCompleted: function (step) {
            return this.steps[step].completed();
        },

        isStepActive: function (step) {
            return this.steps[step].active();
        }
    });
});
