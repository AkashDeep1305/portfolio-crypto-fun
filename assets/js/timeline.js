// Scroll-driven timeline animations with GSAP ScrollTrigger
(function initTimeline() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.timeline-item').forEach((item, idx) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      scale: 0.98,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    const img = item.querySelector('img');
    gsap.to(img, {
      scale: 1.06,
      filter: 'contrast(110%) saturate(110%)',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        scrub: true
      }
    });
  });
})();
