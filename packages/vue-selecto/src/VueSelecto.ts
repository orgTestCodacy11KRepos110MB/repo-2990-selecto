import VanillaSelecto, { SelectoOptions, OPTIONS, EVENTS, PROPERTIES, CLASS_NAME } from 'selecto';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Properties } from 'framework-utils';


@Component({})
@Properties(OPTIONS as any, (prototype, name) => {
    Prop()(prototype, name);
})
export default class VueSelecto extends Vue {
    private selecto!: VanillaSelecto;
    public render(h: CreateElement) {
        return h('div', {
            class: CLASS_NAME,
            ref: 'target',
        });
    }
    public mounted() {
        const options: Partial<SelectoOptions> = {};

        OPTIONS.forEach((name) => {
            options[name] = this.$props[name];
        });

        this.selecto = new VanillaSelecto({
            ...options,
            target: this.$refs.target as any,
        });

        const selecto = this.selecto;

        EVENTS.forEach((name, i) => {
            selecto.on(name, (e) => {
                this.$emit(name, { ...e });
            });
        });
    }
    public updated() {
        const props = this.$props;
        const selecto = this.selecto;

        PROPERTIES.forEach((name) => {
            if (selecto[name] !== props[name]) {
                (selecto as any)[name] = props[name];
            }
        });
    }
    public beforeDestroy() {
        this.selecto.destroy();
    }
}
