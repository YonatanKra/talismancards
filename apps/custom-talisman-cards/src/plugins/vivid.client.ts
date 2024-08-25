import * as vivid from '@vonage/vivid';

export default defineNuxtPlugin(nuxtApp => {

    Object.entries(vivid).forEach(([name, value]) => {
        
        if (name.startsWith('register')) {
            value('vwc');
        }
    });
});