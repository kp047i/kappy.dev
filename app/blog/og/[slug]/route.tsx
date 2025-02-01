import { ImageResponse } from "next/og";

import { getBlogPost } from "@/features/blog/utils";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    return Response.json(
      {
        error: "Not Found",
      },
      {
        status: 404,
      }
    );
  }

  const color = ["#f2a766", "#ea6d25", "#db541b"];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          color: "#011322",
          background: "#fefafa",
          width: "100%",
          height: "100%",
          padding: "40px 40px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 56,
            }}
          >
            {post.metadata.emoji}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
            }}
          >
            {post.metadata.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            position: "absolute",
            right: 56,
            bottom: 56,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
          }}
        >
          kappy.dev
          <img
            width={40}
            height={40}
            src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
            style={{
              borderRadius: "50%",
            }}
          />
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="261"
          height="151"
          viewBox="0 0 261 151"
          fill="none"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <g filter="url(#filter0_d_149_136)">
            <path
              d="M295 107.644C295 141.338 251.518 154.863 232.406 127.113C230.467 124.297 228.96 121.208 227.933 117.946L217.887 86.0162C204.297 42.8217 154.946 22.4342 114.832 43.443C81.4109 60.9469 40.1535 49.9699 19.8496 18.1719L10.4533 3.45642C5.07075 -4.97318 3.5048 -15.2861 6.1425 -24.9335C10.3507 -40.3255 24.3356 -51 40.2924 -51L231.181 -51C266.427 -51 295 -22.4274 295 12.8187L295 107.644Z"
              fill="url(#paint0_linear_149_136)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_149_136"
              x="0.888916"
              y="-51"
              width="298.111"
              height="201.033"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_149_136"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_149_136"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_149_136"
              x1="-27.0399"
              y1="129.056"
              x2="80.6323"
              y2="-109.798"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color={color[2]} />
              <stop offset="0.526958" stop-color={color[1]} />
              <stop offset="1" stop-color={color[0]} />
            </linearGradient>
          </defs>
        </svg>

        <svg
          width="237"
          height="182"
          viewBox="0 0 237 182"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
          }}
        >
          <g filter="url(#filter0_d_305_17)">
            <path
              d="M-48 44.9163C-48 9.48362 -1.52275 -3.70576 17.0888 26.4453C18.8042 29.2243 20.1241 32.2287 21.0105 35.3719L37.5815 94.1341C48.6217 133.284 91.981 153.359 128.976 136.449C164.253 120.325 205.778 137.786 218.931 174.275L225.5 192.5C233.695 210.53 220.515 231 200.709 231H20.526C-17.3199 231 -48 200.32 -48 162.474V44.9163Z"
              fill="url(#paint0_linear_305_17)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_305_17"
              x="-55"
              y="0.689453"
              width="291.972"
              height="237.311"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="1" dy="-1" />
              <feGaussianBlur stdDeviation="4" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_305_17"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_305_17"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_305_17"
              x1="13.832"
              y1="21.5244"
              x2="285.507"
              y2="245.05"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color={color[0]} />
              <stop offset="0.573434" stop-color={color[1]} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
