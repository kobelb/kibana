import * as k8s from '@kubernetes/client-node';
import { rendezvousHash } from './rendevzous_hash';

function range (start: number, end: number) {
  const nums: number[] = [];
  for (let i = start; i < end; ++i) {
    nums.push(i);
  }
  return nums;
 }



export class TaskPartitioner {
  private readonly podName: string = process.env.HOSTNAME!;
  private readonly allPartitions: number[];
  private readonly k8sNamespace: string;
  private readonly k8sServiceLabelSelector: string;

  constructor(k8sNamespace: string, k8sServiceLabelSelector: string) {
    this.allPartitions = range(0, 360);
    this.k8sNamespace = k8sNamespace;
    this.k8sServiceLabelSelector = k8sServiceLabelSelector;
  }

  async getPartitions() : Promise<number[]> {
    const allPodNames = await this.getAllPodNames();
    const podPartitions = rendezvousHash(this.podName, allPodNames, this.allPartitions, 2);
    console.log({ podName: this.podName, partitionsLength: podPartitions.length, partitions: podPartitions});
    return podPartitions;
  }

  private async getAllPodNames() : Promise<string[]> {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const services = await k8sApi.listNamespacedService(this.k8sNamespace, undefined, undefined, undefined, undefined, this.k8sServiceLabelSelector);
    if (services.body.items.length !== 1) {
      throw new Error(`Expected to get 1 service, received ${services.body.items.length}`);
    }

    const serviceSelector = services.body.items[0].spec?.selector;
    if (serviceSelector === undefined) {
      throw new Error(`Service's selector is undefined, unable to determine pods that match an empty selector`);
    }
    const podLabelSelector = Object.entries(serviceSelector).map(([key, value]) => `${key}=${value}`).join(',');
    const pods = await k8sApi.listNamespacedPod(this.k8sNamespace, undefined, undefined, undefined, undefined, podLabelSelector);
    return pods.body.items.map(item => {
      if (item.metadata === undefined) {
        throw new Error(`Pod's metadata is undefined, unable to determine name`);
      }

      if (item.metadata.name === undefined) {
        throw new Error(`Pod's metadata.name is undefined, unable to determine name`);
      }

      return item.metadata!.name!;
    });
  }
}
