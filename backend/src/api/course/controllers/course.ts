/**
 * course controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
    async find(ctx) {
        // Custom logic to optimize API calls with population
        ctx.query = {
            ...ctx.query,
            populate: {
                modules: {
                    populate: {
                        lectures: true,
                    },
                },
                teacher: true,
                announcements: true,
                liveClasses: true,
            },
        };

        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },
}));
