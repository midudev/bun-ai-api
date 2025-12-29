import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AIService } from '../types';

interface ServiceFactory {
    create: () => AIService;
    isEnabled: () => boolean;
}

export const createServices = async (): Promise<AIService[]> => {
    const servicesDir = import.meta.dir;
    const files = await readdir(servicesDir);
    const services: AIService[] = [];

    for (const file of files) {
        if ((file.endsWith('.ts') || file.endsWith('.js')) && file !== 'index.ts' && !file.endsWith('.d.ts')) {
            try {
                const module = await import(join(servicesDir, file));

                // Find any export that matches the ServiceFactory interface
                for (const key of Object.keys(module)) {
                    const candidate = module[key];
                    if (
                        candidate &&
                        typeof candidate === 'object' &&
                        typeof candidate.create === 'function' &&
                        typeof candidate.isEnabled === 'function'
                    ) {
                        const factory = candidate as ServiceFactory;
                        if (factory.isEnabled()) {
                            console.log(`Enabling service ${key}`);
                            services.push(factory.create());
                        } else {
                            console.log(`Disabling service ${key}`);
                        }
                    } else {
                    }
                }
            } catch (err) {
                console.error(`Error loading service ${file}:`, err);
            }
        }
    }

    return services;
}
