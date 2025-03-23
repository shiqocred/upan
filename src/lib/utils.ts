import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateToken = (length: number = 16): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

interface DataResponseProp {
  executive_summary: string;

  critical_areas_for_improvement: {
    description: string;
    data: {
      title: string;
      issue: string;
      impact: string;
      fix: string;
    }[];
  };

  top_competitive_advantages: {
    description: string;
    data: {
      title: string;
      data: string;
      edge: string;
    }[];
  };

  detailed_category_analysis: {
    description: string;
    data: {
      title: string;
      score: number;
      logic: string;
      benchmark: string;
      insight: string;
    }[];
  };

  recommended_action_plan: {
    description: string;
    data: {
      immediate: {
        title: string;
        task: string;
        sample?: string;
        why: string;
      }[];
      short_term: {
        title: string;
        task: string;
        sample?: string;
        why: string;
      }[];
      long_term: {
        title: string;
        task: string;
        sample?: string;
        why: string;
      }[];
    };
  };

  market_intelligence: {
    description: string;
    data: {
      title: string;
      trend: string;
      action: string;
    }[];
  };

  rewritten_profile_draft: {
    title: string;
    overview: string;
  };

  closing_motivation: string;
}

export const dataResponse: DataResponseProp = {
  executive_summary:
    "After analyzing over 50 data points from your Upwork profile as a Web Developer, including your overview, portfolio, skills, and client history, we’ve identified a mix of impressive strengths and untapped opportunities. Your consistent 5-star ratings and rapid response time position you well, but a generic overview, modest hourly rate, and sparse portfolio details are holding you back from premium clients and higher earnings—potentially leaving 25-40% more income on the table. With targeted updates, you can boost visibility, command better rates, and align with 2025’s hottest trends. This report provides a roadmap to elevate your profile from solid to standout.",
  critical_areas_for_improvement: {
    description:
      "Key weaknesses in your profile, with specific examples and their impact.",
    data: [
      {
        title: "Generic Profile Overview",
        issue:
          "Your overview reads, 'Experienced web developer delivering quality solutions,' but lacks specific technologies or results.",
        impact:
          "Missing keywords like 'React' or 'API integration' could cut your search visibility by 50%, as clients search for niche skills.",
        fix: "Name-drop in-demand tools (e.g., TypeScript, Next.js) and quantify achievements (e.g., 'cut load times by 20%').",
      },
      {
        title: "Portfolio Lacks Depth",
        issue:
          "Your portfolio lists 'E-commerce site' and 'Business website,' but only one mentions a result ('improved user engagement').",
        impact:
          "Without detailed case studies or metrics, clients may hesitate, potentially slashing win rates by 30%.",
        fix: "Add specifics like 'Boosted sales 15% with Shopify integration' to showcase problem-solving.",
      },
      {
        title: "Undervalued Hourly Rate",
        issue:
          "Your $25/hour rate is low for your 5 years of experience and 5-star feedback.",
        impact:
          "This undersells your expertise, signaling lower quality to high-budget clients who pay $35-45/hour for similar skills.",
        fix: "Adjust to $35/hour to match market standards and attract premium projects.",
      },
      {
        title: "Outdated Skills Focus",
        issue:
          "You list 'PHP, HTML, CSS' but omit trending frameworks like GraphQL or Tailwind CSS.",
        impact:
          "This risks losing relevance as 2025 clients prioritize modern stacks, reducing invites by 20-25%.",
        fix: "Highlight newer tools you’ve used or upskill in (e.g., 'Learning Next.js for scalable apps').",
      },
      {
        title: "Gaps in Job History",
        issue: "A 4-month gap between contracts in 2024 stands out.",
        impact:
          "This inconsistency could raise doubts about reliability, impacting Upwork’s algorithm favorability.",
        fix: "Fill gaps with self-projects (e.g., 'Built a personal React app during downtime').",
      },
    ],
  },
  top_competitive_advantages: {
    description:
      "Your profile shines in these areas, backed by data and aligned with Upwork's priorities:",
    data: [
      {
        title: "Stellar Client Feedback",
        data: "90% of your 20 reviews are 5-star, above the platform's 75% average.",
        edge: "This builds trust and boosts your ranking in client searches.",
      },
      {
        title: "Rapid Response Time",
        data: "You reply within 2 hours, beating the 6-hour average for developers.",
        edge: "Upwork's algorithm favors fast responders, increasing your visibility by up to 40%.",
      },
      {
        title: "Repeat Client Loyalty",
        data: "40% of your work comes from repeat clients, surpassing the 25% norm.",
        edge: "This signals reliability, a top factor for long-term contracts.",
      },
      {
        title: "Professional Presentation",
        data: 'Your profile photo is clear and approachable; job titles like "Full-Stack Web Developer" are concise.',
        edge: "A polished first impression hooks clients browsing dozens of profiles.",
      },
      {
        title: "Relevant Core Skills",
        data: 'Tags like "PHP" and "JavaScript" align with 60% of current job postings.',
        edge: "This keeps you in the running for bread-and-butter projects.",
      },
    ],
  },
  detailed_category_analysis: {
    description:
      "Each score reflects your profile’s performance against Upwork’s algorithm and client expectations, with benchmarks for context.",
    data: [
      {
        title: "Profile Visibility",
        score: 6.8,
        logic:
          "Your title 'Web Developer' and overview lack niche keywords (e.g., 'React Developer' or 'API Specialist'). Keyword-optimized profiles get 50% more views.",
        benchmark: "Top 20% of developers score 8.5+ with targeted terms.",
        insight: "You’re findable but not standing out in crowded searches.",
      },
      {
        title: "Portfolio Quality",
        score: 7.2,
        logic:
          "Two projects listed, but only one cites a metric ('improved engagement'). Detailed portfolios with results command 35% higher rates.",
        benchmark:
          "8.0+ scores include 3+ case studies with stats like '20% faster load time.'",
        insight: "Solid work needs more storytelling to shine.",
      },
      {
        title: "Market Positioning",
        score: 5.5,
        logic:
          "$25/hour is below the $35-45/hour range for your 5-year experience and feedback. Market data shows specialists earn 25-40% more.",
        benchmark: "Mid-tier developers at $30+ attract bigger budgets.",
        insight: "You’re priced for entry-level, not expertise.",
      },
      {
        title: "Client Relationship History",
        score: 8.5,
        logic:
          "40% repeat clients and 90% 5-star ratings are stellar, but a 4-month gap dents consistency. Upwork favors steady freelancers.",
        benchmark: "Top performers maintain 9.0+ with no gaps over 3 months.",
        insight: "You’re a client favorite—smooth the timeline.",
      },
      {
        title: "Technology Stack Relevance",
        score: 6.5,
        logic:
          "PHP and JavaScript are solid, but missing Next.js, GraphQL, or Web3 skills lags behind 2025 demand. Trending stacks draw 20% more invites.",
        benchmark: "8.0+ reflects mastery of modern frameworks.",
        insight: "You’re relevant but not cutting-edge.",
      },
    ],
  },
  recommended_action_plan: {
    description:
      "Here’s a step-by-step strategy tailored to your profile, with timelines and examples:",
    data: {
      immediate: [
        {
          title: "Revamp Overview",
          task: "Add specific skills and results.",
          sample:
            "Full-stack developer specializing in PHP, JavaScript, and React, delivering 20% faster websites and 15% sales boosts for e-commerce clients.",
          why: "Boosts visibility instantly.",
        },
        {
          title: "Enhance Portfolio",
          task: "Add a case study for 'E-commerce site.'",
          sample:
            "Built a Shopify store, integrating APIs for real-time inventory, increasing sales by 15%.",
          why: "Proves impact to clients.",
        },
        {
          title: "Fill Skills Gaps",
          task: "Add 'React' and 'Tailwind CSS' to skills tags.",
          why: "Matches trending job posts.",
        },
      ],
      short_term: [
        {
          title: "Request Testimonials",
          task: "Message your top 3 repeat clients for feedback.",
          sample:
            "Hi [Client], I’d love your thoughts on our project for my Upwork profile.",
          why: "More reviews amplify trust.",
        },
        {
          title: "Raise Your Rate",
          task: "Bump to $35/hour, reflecting your 5-year experience.",
          why: "Aligns with market value, targeting bigger budgets.",
        },
        {
          title: "Address Job Gaps",
          task: "Add a self-project (e.g., 'Developed a React-based portfolio site').",
          why: "Shows continuous activity.",
        },
      ],
      long_term: [
        {
          title: "Specialize in a Niche",
          task: "Focus on e-commerce (e.g., Shopify or WooCommerce) based on your past work.",
          why: "Niches command 30% higher rates.",
        },
        {
          title: "Create Content",
          task: "Write a blog, 'How I Optimized a Shopify Store for 15% More Sales,' and link it in your portfolio.",
          why: "Establishes authority.",
        },
        {
          title: "Upskill Strategically",
          task: "Learn Next.js via a quick course (e.g., free tutorials online).",
          sample: "Add 'Building scalable apps with Next.js' to overview.",
          why: "Future-proofs your stack.",
        },
      ],
    },
  },
  market_intelligence: {
    description: "Current trends for Web Developers as of March 2025:",
    data: [
      {
        title: "Web3 Demand Surge",
        trend:
          "Budgets for blockchain-integrated projects are up 30%, per Upwork data.",
        action: "Mention any crypto-related skills or start learning basics.",
      },
      {
        title: "Cybersecurity Priority",
        trend: "20% more postings seek secure coding expertise this quarter.",
        action: 'Highlight "secure API development" if applicable.',
      },
      {
        title: "Rising Competition",
        trend:
          "Proposals per job rose 15% in 6 months, favoring fast responders.",
        action: "Keep your 2-hour response streak to stand out.",
      },
    ],
  },
  rewritten_profile_draft: {
    title:
      "Full-Stack Web Developer | PHP, JavaScript, Shopify & React Specialist",
    overview:
      "With over 5 years of experience as a full-stack web developer, I craft high-performance solutions that drive results—think 15% sales boosts for e-commerce clients and 20% faster load times for business sites. My toolkit? PHP, JavaScript, HTML, CSS, and React, paired with a passion for clean, secure code that powers everything from Shopify stores to custom APIs. I’ve earned a 90% 5-star rating across 20 projects, with 40% of clients coming back for more, thanks to my focus on delivering ROI fast—like a recent online store that hit its sales goal in under a month. I’m diving into Next.js to build scalable, future-ready apps and specialize in e-commerce, where I turn ideas into revenue. Need a reliable partner who responds in 2 hours and gets it right the first time? Let’s build something amazing together.",
  },
  closing_motivation:
    "Your profile already has a strong foundation—stellar reviews, loyal clients, and a professional vibe. But in a competitive 2025 market, small tweaks can unlock big gains. With these updates, you’re not just keeping up—you’re leaping ahead, ready to snag high-value projects and rates that match your worth. Act now, and watch your Upwork game soar!",
};

export const exampleData = `{"executive_summary":"After analyzing over 50 data points from your Upwork profile as a Web Developer, including your overview, portfolio, skills, and client history, we’ve identified a mix of impressive strengths and untapped opportunities. Your consistent 5-star ratings and rapid response time position you well, but a generic overview, modest hourly rate, and sparse portfolio details are holding you back from premium clients and higher earnings—potentially leaving 25-40% more income on the table. With targeted updates, you can boost visibility, command better rates, and align with 2025’s hottest trends. This report provides a roadmap to elevate your profile from solid to standout.","critical_areas_for_improvement":{"description":"Key weaknesses in your profile, with specific examples and their impact.","data":[{"title":"Generic Profile Overview","issue":"Your overview reads, 'Experienced web developer delivering quality solutions,' but lacks specific technologies or results.","impact":"Missing keywords like 'React' or 'API integration' could cut your search visibility by 50%, as clients search for niche skills.","fix":"Name-drop in-demand tools (e.g., TypeScript, Next.js) and quantify achievements (e.g., 'cut load times by 20%')."},{"title":"Portfolio Lacks Depth","issue":"Your portfolio lists 'E-commerce site' and 'Business website,' but only one mentions a result ('improved user engagement').","impact":"Without detailed case studies or metrics, clients may hesitate, potentially slashing win rates by 30%.","fix":"Add specifics like 'Boosted sales 15% with Shopify integration' to showcase problem-solving."},{"title":"Undervalued Hourly Rate","issue":"Your $25/hour rate is low for your 5 years of experience and 5-star feedback.","impact":"This undersells your expertise, signaling lower quality to high-budget clients who pay $35-45/hour for similar skills.","fix":"Adjust to $35/hour to match market standards and attract premium projects."},{"title":"Outdated Skills Focus","issue":"You list 'PHP, HTML, CSS' but omit trending frameworks like GraphQL or Tailwind CSS.","impact":"This risks losing relevance as 2025 clients prioritize modern stacks, reducing invites by 20-25%.","fix":"Highlight newer tools you’ve used or upskill in (e.g., 'Learning Next.js for scalable apps')."},{"title":"Gaps in Job History","issue":"A 4-month gap between contracts in 2024 stands out.","impact":"This inconsistency could raise doubts about reliability, impacting Upwork’s algorithm favorability.","fix":"Fill gaps with self-projects (e.g., 'Built a personal React app during downtime')."}]},"top_competitive_advantages":{"description":"Your profile shines in these areas, backed by data and aligned with Upwork's priorities:","data":[{"title":"Stellar Client Feedback","data":"90% of your 20 reviews are 5-star, above the platform's 75% average.","edge":"This builds trust and boosts your ranking in client searches."},{"title":"Rapid Response Time","data":"You reply within 2 hours, beating the 6-hour average for developers.","edge":"Upwork's algorithm favors fast responders, increasing your visibility by up to 40%."},{"title":"Repeat Client Loyalty","data":"40% of your work comes from repeat clients, surpassing the 25% norm.","edge":"This signals reliability, a top factor for long-term contracts."},{"title":"Professional Presentation","data":"Your profile photo is clear and approachable; job titles like \"Full-Stack Web Developer\" are concise.","edge":"A polished first impression hooks clients browsing dozens of profiles."},{"title":"Relevant Core Skills","data":"Tags like \"PHP\" and \"JavaScript\" align with 60% of current job postings.","edge":"This keeps you in the running for bread-and-butter projects."}]},"detailed_category_analysis":{"description":"Each score reflects your profile’s performance against Upwork’s algorithm and client expectations, with benchmarks for context.","data":[{"title":"Profile Visibility","score":6.8,"logic":"Your title 'Web Developer' and overview lack niche keywords (e.g., 'React Developer' or 'API Specialist'). Keyword-optimized profiles get 50% more views.","benchmark":"Top 20% of developers score 8.5+ with targeted terms.","insight":"You’re findable but not standing out in crowded searches."},{"title":"Portfolio Quality","score":7.2,"logic":"Two projects listed, but only one cites a metric ('improved engagement'). Detailed portfolios with results command 35% higher rates.","benchmark":"8.0+ scores include 3+ case studies with stats like '20% faster load time.'","insight":"Solid work needs more storytelling to shine."},{"title":"Market Positioning","score":5.5,"logic":"$25/hour is below the $35-45/hour range for your 5-year experience and feedback. Market data shows specialists earn 25-40% more.","benchmark":"Mid-tier developers at $30+ attract bigger budgets.","insight":"You’re priced for entry-level, not expertise."},{"title":"Client Relationship History","score":8.5,"logic":"40% repeat clients and 90% 5-star ratings are stellar, but a 4-month gap dents consistency. Upwork favors steady freelancers.","benchmark":"Top performers maintain 9.0+ with no gaps over 3 months.","insight":"You’re a client favorite—smooth the timeline."},{"title":"Technology Stack Relevance","score":6.5,"logic":"PHP and JavaScript are solid, but missing Next.js, GraphQL, or Web3 skills lags behind 2025 demand. Trending stacks draw 20% more invites.","benchmark":"8.0+ reflects mastery of modern frameworks.","insight":"You’re relevant but not cutting-edge."}]},"recommended_action_plan":{"description":"Here’s a step-by-step strategy tailored to your profile, with timelines and examples:","data":{"immediate":[{"title":"Revamp Overview","task":"Add specific skills and results.","sample":"Full-stack developer specializing in PHP, JavaScript, and React, delivering 20% faster websites and 15% sales boosts for e-commerce clients.","why":"Boosts visibility instantly."},{"title":"Enhance Portfolio","task":"Add a case study for 'E-commerce site.'","sample":"Built a Shopify store, integrating APIs for real-time inventory, increasing sales by 15%.","why":"Proves impact to clients."},{"title":"Fill Skills Gaps","task":"Add 'React' and 'Tailwind CSS' to skills tags.","why":"Matches trending job posts."}],"short_term":[{"title":"Request Testimonials","task":"Message your top 3 repeat clients for feedback.","sample":"Hi [Client], I’d love your thoughts on our project for my Upwork profile.","why":"More reviews amplify trust."},{"title":"Raise Your Rate","task":"Bump to $35/hour, reflecting your 5-year experience.","why":"Aligns with market value, targeting bigger budgets."},{"title":"Address Job Gaps","task":"Add a self-project (e.g., 'Developed a React-based portfolio site').","why":"Shows continuous activity."}],"long_term":[{"title":"Specialize in a Niche","task":"Focus on e-commerce (e.g., Shopify or WooCommerce) based on your past work.","why":"Niches command 30% higher rates."},{"title":"Create Content","task":"Write a blog, 'How I Optimized a Shopify Store for 15% More Sales,' and link it in your portfolio.","why":"Establishes authority."},{"title":"Upskill Strategically","task":"Learn Next.js via a quick course (e.g., free tutorials online).","sample":"Add 'Building scalable apps with Next.js' to overview.","why":"Future-proofs your stack."}]}},"market_intelligence":{"description":"Current trends for Web Developers as of March 2025:","data":[{"title":"Web3 Demand Surge","trend":"Budgets for blockchain-integrated projects are up 30%, per Upwork data.","action":"Mention any crypto-related skills or start learning basics."},{"title":"Cybersecurity Priority","trend":"20% more postings seek secure coding expertise this quarter.","action":"Highlight \"secure API development\" if applicable."},{"title":"Rising Competition","trend":"Proposals per job rose 15% in 6 months, favoring fast responders.","action":"Keep your 2-hour response streak to stand out."}]},"rewritten_profile_draft":{"title":"Full-Stack Web Developer | PHP, JavaScript, Shopify & React Specialist","overview":"With over 5 years of experience as a full-stack web developer, I craft high-performance solutions that drive results—think 15% sales boosts for e-commerce clients and 20% faster load times for business sites. My toolkit? PHP, JavaScript, HTML, CSS, and React, paired with a passion for clean, secure code that powers everything from Shopify stores to custom APIs. I’ve earned a 90% 5-star rating across 20 projects, with 40% of clients coming back for more, thanks to my focus on delivering ROI fast—like a recent online store that hit its sales goal in under a month. I’m diving into Next.js to build scalable, future-ready apps and specialize in e-commerce, where I turn ideas into revenue. Need a reliable partner who responds in 2 hours and gets it right the first time? Let’s build something amazing together."},"closing_motivation":"Your profile already has a strong foundation—stellar reviews, loyal clients, and a professional vibe. But in a competitive 2025 market, small tweaks can unlock big gains. With these updates, you’re not just keeping up—you’re leaping ahead, ready to snag high-value projects and rates that match your worth. Act now, and watch your Upwork game soar!"}`;
