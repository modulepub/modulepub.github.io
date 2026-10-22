import { defineClientConfig } from 'vuepress/client'
import SiteHome from './theme/components/SiteHome.vue'
import AiLanding from './theme/components/AiLanding.vue'
import CommunityLanding from './theme/components/CommunityLanding.vue'
import AiSetup from './theme/components/AiSetup.vue'
import SiteHomeHant from './theme/components/SiteHomeHant.vue'
import AiLandingHant from './theme/components/AiLandingHant.vue'
import CommunityLandingHant from './theme/components/CommunityLandingHant.vue'
import AiSetupHant from './theme/components/AiSetupHant.vue'
import SiteHomeEn from './theme/components/SiteHomeEn.vue'
import AiLandingEn from './theme/components/AiLandingEn.vue'
import CommunityLandingEn from './theme/components/CommunityLandingEn.vue'
import './theme/styles/custom.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('site-home', SiteHome)
    app.component('ai-landing', AiLanding)
    app.component('community-landing', CommunityLanding)
    app.component('ai-setup', AiSetup)
    app.component('site-home-hant', SiteHomeHant)
    app.component('ai-landing-hant', AiLandingHant)
    app.component('community-landing-hant', CommunityLandingHant)
    app.component('ai-setup-hant', AiSetupHant)
    app.component('site-home-en', SiteHomeEn)
    app.component('ai-landing-en', AiLandingEn)
    app.component('community-landing-en', CommunityLandingEn)
  },
})
