import { nextTick } from 'vue';
import { mount, enableAutoUnmount } from '@vue/test-utils';
import { useRouter } from 'vue-router'
import '@vonage/vivid/button';
import '@vonage/vivid/text-field';
import Welcome from '../Welcome.vue';

vi.mock('vue-router', () => ({
    useRouter: vi.fn().mockReturnValue({
        push: vi.fn(),
    })
}));


describe('Welcome Component', () => {
    enableAutoUnmount(beforeEach);
    async function waitForWebComponentsCycle() {
        await new Promise(res => setTimeout(res, 15));
    }

    async function setInputFieldValue(wrapper, fieldQuery, value) {
        const field = wrapper.find(fieldQuery);
        await field.element.setAttribute('current-value', value);
        await field.trigger('input');
        await waitForWebComponentsCycle();
    }

    function getSubmitButton(wrapper) {
        return wrapper.find('vwc-button');    
    }

    function getForm(wrapper) {
        return wrapper.find('form');    
    }

    async function mountComponent() {
        const wrapper = mount(Welcome, {
            props: {
                title: 'custom-talisman-cards',
            },
        });
        await nextTick();
        await waitForWebComponentsCycle();
        return wrapper;
    }

    let mockPush, wrapper;

    beforeEach(async () => {
        mockPush = useRouter().push;
        wrapper = await mountComponent();
    });


    beforeEach(() => {
        mockPush.mockReset()
    });

    it('should enable the submit button when the form is valid', async () => {
        await setInputFieldValue(wrapper, '[name="name"]', 'John Doe');
        await setInputFieldValue(wrapper, '[name="phone"]', '1234567890');        
        
        expect(wrapper.find('vwc-button').attributes('disabled')).toBeUndefined();
    });
    
    it('should disable the submit button when the form is invalid', async () => {
        expect(getSubmitButton(wrapper).attributes('disabled')).toBeDefined();
    });

    it('should navigate to the editor route with the correct parameters when the form is submitted', async () => {
        
        await setInputFieldValue(wrapper, '[name="name"]', 'John Doe');
        await setInputFieldValue(wrapper, '[name="phone"]', '1234567890');        
        
        // Submit the form
        await getForm(wrapper).trigger('submit.prevent');
        await nextTick();
        await waitForWebComponentsCycle();

        // Assert that the user is navigated to the editor route with the correct parameters
        expect(mockPush).toHaveBeenCalledWith({
            name: 'editor',
            query: { name: 'John Doe', phone: '1234567890' },
        });
    });
});