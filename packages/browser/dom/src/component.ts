export type RenderFunction = () => HTMLElement
export type ComponentFunction = () => RenderFunction
export function Component(comp: ComponentFunction){

  const uid = crypto.randomUUID();
  console.log(uid)
  comp.bind(1)()


}

function render(){

}
