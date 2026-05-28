<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-footer__brand-mark">
          <img class="site-footer__brand-img" src="/brand-icon.png" alt="" aria-hidden="true" />
        </span>
        <span>{{ t('brand.name') }}</span>
      </div>

      <nav class="site-footer__links" :aria-label="t('footer.linksAria')">
        <NuxtLink class="site-footer__link" to="/legal/terms">
          {{ t('footer.links.agreement') }}
        </NuxtLink>
        <NuxtLink class="site-footer__link" to="/legal/privacy">
          {{ t('footer.links.privacy') }}
        </NuxtLink>
        <NuxtLink class="site-footer__link" to="/legal/third-party-sdk">
          {{ t('footer.links.sdk') }}
        </NuxtLink>
        <a
          v-if="supportEmail"
          class="site-footer__link"
          :href="`mailto:${supportEmail}`"
        >
          {{ t('footer.links.contact') }}
        </a>
      </nav>

      <p class="site-footer__copy">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { public: pub } = useRuntimeConfig()
const supportEmail = computed(() => String(pub.supportEmail || '').trim())
</script>

<style lang="scss" scoped>
.site-footer {
  margin-top: auto;
  background: #0f172a;
  color: rgba(255, 255, 255, 0.7);
}

.site-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.site-footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 600;
}

.site-footer__brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 14px -8px rgba(0, 0, 0, 0.55);
  padding: 2px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.site-footer__brand-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.site-footer__links {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 13px;
}

.site-footer__link {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  position: relative;
  transition: color 0.18s ease;

  &:hover {
    color: #ffffff;
  }

  &.router-link-exact-active {
    color: #ffffff;
    font-weight: 600;
  }

  /* 用一个空 ::after 作为悬浮下划线，避免链接位移 */
  &::after {
    content: '';
    display: block;
    height: 1px;
    background: currentColor;
    opacity: 0;
    transform: translateY(2px);
    transition: opacity 0.18s ease;
  }

  &:hover::after {
    opacity: 0.6;
  }
}

.site-footer__copy {
  margin: 0;
  font-size: 13px;
}

@media (max-width: $breakpoint-mobile) {
  .site-footer__inner {
    padding: 24px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .site-footer__links {
    gap: 14px;
  }
}
</style>
