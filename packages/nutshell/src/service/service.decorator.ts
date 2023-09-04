import { TasksObject, Task } from '@rondymesquita/tasks'
import { ExportedClassMembers, exportClassMembers } from '../utils'
import { ServiceComponent } from './service.component'

interface Taskable {
  toTasks(): ExportedClassMembers<TasksObject>
}

export class ServiceDecorator extends ServiceComponent implements Taskable {
  // constructor(...params: ConstructorParameters<typeof ServiceComponent>) {
  //   super(...params)
  // }
  toTasks() {
    return exportClassMembers<TasksObject>(this, ['constructor'])
  }
}
