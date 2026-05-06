'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/icons/icon';

type BotProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    svg: {
      animate: {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        },
      },
    },
    path1: {},
    rect: {},
    path2: {},
    path3: {},
    path4: {},
    path5: {},
  } satisfies Record<string, Variants>,
  blink: {
    svg: {
      animate: {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        },
      },
    },
    path4: {
      animate: {
        scaleY: [1, 0, 1],
        transition: {
          times: [0, 0.1, 0.2],
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        },
      },
    },
    path5: {
      animate: {
        scaleY: [1, 0, 1],
        transition: {
          times: [0, 0.1, 0.2],
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        },
      },
    },
  } satisfies Record<string, Variants>,
  happy: {
    svg: {
      animate: {
        y: [0, -4, 0],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        },
      },
    },
    path1: {
      animate: {
        rotate: [0, 360],
        transition: {
          repeat: Infinity,
          duration: 1,
          ease: "linear"
        }
      }
    },
    rect: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        }
      }
    },
    path4: {
      animate: {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        }
      }
    },
    path5: {
      animate: {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        }
      }
    },
  } satisfies Record<string, Variants>,
  thinking: {
    svg: {
      animate: {
        x: [0, -1, 1, -1, 1, 0],
        y: [0, -1, 1, -1, 1, 0],
        transition: {
          repeat: Infinity,
          duration: 0.2,
        },
      },
    },
    path1: {
      animate: {
        rotate: [0, 45, -45, 0],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        }
      }
    },
    rect: {
      animate: {
        scale: [1, 1.05, 1],
        skewX: [0, 10, -10, 0],
        transition: {
          repeat: Infinity,
          duration: 0.4,
        }
      }
    },
    path4: {
      animate: {
        scaleY: [1, 0.1, 1],
        opacity: [1, 0.5, 1],
        transition: {
          repeat: Infinity,
          duration: 0.3,
        }
      }
    },
    path5: {
      animate: {
        scaleY: [1, 0.1, 1],
        opacity: [1, 0.5, 1],
        transition: {
          repeat: Infinity,
          duration: 0.3,
          delay: 0.1
        }
      }
    },
  } satisfies Record<string, Variants>,
  yawn: {
    svg: {
      animate: {
        y: [0, -10, 0],
        scaleX: [1, 0.9, 1],
        transition: {
          duration: 2,
        },
      },
    },
    path1: {
      animate: {
        rotate: [0, -45, 0],
        transition: { duration: 2 }
      }
    },
    rect: {
      animate: {
        scaleY: [1, 1.2, 1],
        transition: { duration: 2 }
      }
    },
    path4: {
      animate: {
        scaleY: [1, 0, 1],
        transition: { duration: 2 }
      }
    },
    path5: {
      animate: {
        scaleY: [1, 0, 1],
        transition: { duration: 2 }
      }
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: BotProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.g
        variants={variants.svg}
        initial="initial"
        animate={controls}
      >
        <motion.path
          d="M12 8V4H8"
          variants={variants.path1}
          initial="initial"
          animate={controls}
        />
        <motion.rect
          width={16}
          height={12}
          x={4}
          y={8}
          rx={2}
          variants={variants.rect}
          initial="initial"
          animate={controls}
        />
        <motion.path
          d="M2 14h2"
          variants={variants.path2}
          initial="initial"
          animate={controls}
        />
        <motion.path
          d="M20 14h2"
          variants={variants.path3}
          initial="initial"
          animate={controls}
        />
        <motion.path
          d="M15 13v2"
          variants={variants.path4}
          initial="initial"
          animate={controls}
        />
        <motion.path
          d="M9 13v2"
          variants={variants.path5}
          initial="initial"
          animate={controls}
        />
      </motion.g>
    </motion.svg>
  );
}

function Bot(props: BotProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Bot,
  Bot as BotIcon,
  type BotProps,
  type BotProps as BotIconProps,
};
