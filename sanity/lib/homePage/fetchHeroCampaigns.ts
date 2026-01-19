*[_type == "homePage"][0].hero {
  layout,
  autoRotate,
  slides[]->{
    _id,
    content {
      eyebrow,
      headline,
      subhead,
      ctaText
    },
    assets {
      desktopImage {
        asset->{
          _id,
          url,
          metadata { lqip, dimensions }
        },
        hotspot,
        crop
      }
    },
    link {
      type,
      url,
      product->{
        "slug": slug.current,
        title,
        price,
        "image": images[0]
      },
      sale->{
        "slug": slug.current,
        title
      }
    }
  }
}